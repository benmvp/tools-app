"use client";

import { ArrowLeft, ArrowRight, Check, Copy, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import type { EncoderAction, EncoderTool, JwtDecoderAction } from "@/lib/types";
import { CodeEditor } from "./CodeEditor";

interface TransformerEncoderProps {
  action: EncoderAction | JwtDecoderAction;
  defaultInput?: string;
  language?: EncoderTool["language"];
  modes?: { value: string; label: string }[];
  toolName: string;
}

export function TransformerEncoder({
  action,
  defaultInput = "",
  language = "text",
  modes,
  toolName,
}: TransformerEncoderProps) {
  const [leftValue, setLeftValue] = useState(defaultInput);
  const [rightValue, setRightValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiedLeft, setCopiedLeft] = useState(false);
  const [copiedRight, setCopiedRight] = useState(false);
  const [lastAction, setLastAction] = useState<"encode" | "decode" | null>(
    null,
  );

  // Determine if this is a bidirectional tool or decode-only
  const isBidirectional = modes !== undefined;

  const handleEncode = async () => {
    if (!leftValue) return;

    setLoading(true);
    try {
      const result = await (action as EncoderAction)(leftValue, "encode");
      setRightValue(result);
      setLastAction("encode");
      toast.success("Encoded!", {
        description: "Content encoded successfully",
      });
    } catch (error) {
      toast.error("Error", {
        description: error instanceof Error ? error.message : "Encoding failed",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDecode = async () => {
    if (isBidirectional) {
      // Bidirectional: decode from right to left
      if (!rightValue) return;

      setLoading(true);
      try {
        const result = await (action as EncoderAction)(rightValue, "decode");
        setLeftValue(result);
        setLastAction("decode");
        toast.success("Decoded!", {
          description: "Content decoded successfully",
        });
      } catch (error) {
        toast.error("Error", {
          description:
            error instanceof Error ? error.message : "Decoding failed",
        });
      } finally {
        setLoading(false);
      }
    } else {
      // Decode-only (JWT): decode from left to right
      if (!leftValue) return;

      setLoading(true);
      try {
        const result = await (action as JwtDecoderAction)(leftValue);
        setRightValue(result);
        setLastAction("decode");
        toast.success("Decoded!", {
          description: "Token decoded successfully",
        });
      } catch (error) {
        toast.error("Error", {
          description:
            error instanceof Error ? error.message : "Decoding failed",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCopyLeft = async () => {
    if (!leftValue) return;

    await navigator.clipboard.writeText(leftValue);
    setCopiedLeft(true);
    toast.success("Copied!", {
      description: "Content copied to clipboard",
    });
    setTimeout(() => setCopiedLeft(false), 2000);
  };

  const handleCopyRight = async () => {
    if (!rightValue) return;

    await navigator.clipboard.writeText(rightValue);
    setCopiedRight(true);
    toast.success("Copied!", {
      description: "Content copied to clipboard",
    });
    setTimeout(() => setCopiedRight(false), 2000);
  };

  // Dynamic labels based on last action
  const getLeftLabel = () => {
    if (!isBidirectional) {
      // JWT decoder: left is always input token
      return toolName.includes("JWT") ? "JWT Token" : "Input";
    }
    // Bidirectional: swap based on last action
    if (lastAction === "decode") {
      return "Plain Text";
    }
    return "Plain Text";
  };

  const getRightLabel = () => {
    if (!isBidirectional) {
      // JWT decoder: right is always decoded output
      return toolName.includes("JWT") ? "Decoded JSON" : "Output";
    }
    // Bidirectional: swap based on last action
    if (lastAction === "decode") {
      return "Encoded";
    }
    return "Encoded";
  };

  return (
    <div className="space-y-4">
      {/* Editors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left Editor */}
        <div className="space-y-2">
          <span className="text-sm font-medium block">{getLeftLabel()}</span>
          <CodeEditor
            value={leftValue}
            onChange={setLeftValue}
            label={getLeftLabel()}
            language={language}
          />
          <div className="flex gap-2">
            {isBidirectional && (
              <Button onClick={handleEncode} disabled={!leftValue || loading}>
                {loading && lastAction === null ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Encoding...
                  </>
                ) : (
                  <>
                    Encode
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            )}
            {!isBidirectional && (
              <Button onClick={handleDecode} disabled={!leftValue || loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Decoding...
                  </>
                ) : (
                  <>
                    Decode
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            )}
            <Button
              variant="outline"
              onClick={handleCopyLeft}
              disabled={!leftValue}
              size="icon"
              aria-label="Copy left editor content"
            >
              {copiedLeft ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Right Editor */}
        <div className="space-y-2">
          <span className="text-sm font-medium block">{getRightLabel()}</span>
          <CodeEditor
            value={rightValue}
            onChange={setRightValue}
            label={getRightLabel()}
            language={language}
          />
          <div className="flex gap-2">
            {isBidirectional && (
              <Button onClick={handleDecode} disabled={!rightValue || loading}>
                {loading && lastAction === "decode" ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Decoding...
                  </>
                ) : (
                  <>
                    <ArrowLeft className="ml-2 h-4 w-4" />
                    Decode
                  </>
                )}
              </Button>
            )}
            <Button
              variant="outline"
              onClick={handleCopyRight}
              disabled={!rightValue}
              size="icon"
              aria-label="Copy right editor content"
            >
              {copiedRight ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
