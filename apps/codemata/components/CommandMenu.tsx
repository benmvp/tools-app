"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { getRecentTools } from "@/lib/recent-tools";
import {
  POPULAR_TOOLS,
  SEARCH_INDEX,
  type SearchableToolItem,
} from "@/lib/search-index";
import { ALL_TOOLS } from "@/lib/tools-data";

interface CommandMenuProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ALL_TOOLS_FLAT = Object.values(ALL_TOOLS).flat();

export function CommandMenu({ open, onOpenChange }: CommandMenuProps) {
  const router = useRouter();
  const [recentTools, setRecentTools] = useState<SearchableToolItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Load recent tools on mount and when modal opens
  useEffect(() => {
    if (!open) return;

    const recentUrls = getRecentTools();
    const recentItems = recentUrls
      .map((url) => SEARCH_INDEX.find((item) => item.url === url))
      .filter((item): item is SearchableToolItem => item !== undefined);

    setRecentTools(recentItems);
  }, [open]);

  // Reset search query when modal closes
  useEffect(() => {
    if (!open) {
      setSearchQuery("");
    }
  }, [open]);

  const handleSelect = useCallback(
    (url: string) => {
      onOpenChange(false);
      router.push(url);
    },
    [router, onOpenChange],
  );

  // Get popular tools for empty state (excluding recent tools)
  const recentUrls = new Set(recentTools.map((tool) => tool.url));
  const popularTools = POPULAR_TOOLS.map((url) =>
    SEARCH_INDEX.find((item) => item.url === url),
  )
    .filter((item): item is SearchableToolItem => item !== undefined)
    .filter((tool) => !recentUrls.has(tool.url));

  // Get tool icon from the tools data
  const getToolIcon = (tool: SearchableToolItem) => {
    const slug = tool.url.split("/").pop() || "";
    // Search through all tool categories
    const matchingTool = ALL_TOOLS_FLAT.find((t) => t.url === tool.url);

    return matchingTool?.icon;
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput
        placeholder="Search tools..."
        value={searchQuery}
        onValueChange={setSearchQuery}
        aria-label="Search tools"
      />
      <CommandList>
        <CommandEmpty>No tools found.</CommandEmpty>

        {/* Show recent/popular tools ONLY when no search query */}
        {!searchQuery && (
          <>
            {/* Recent Tools section */}
            {recentTools.length > 0 && (
              <CommandGroup heading="Recent Tools">
                {recentTools.map((tool) => {
                  const Icon = getToolIcon(tool);

                  return (
                    <CommandItem
                      key={tool.url}
                      value={tool.searchText}
                      onSelect={() => handleSelect(tool.url)}
                    >
                      {Icon && <Icon className="mr-2 h-4 w-4" />}
                      <span>{tool.name}</span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            )}

            {/* Popular Tools section */}
            <CommandGroup heading="Popular Tools">
              {popularTools.map((tool) => {
                const Icon = getToolIcon(tool);

                return (
                  <CommandItem
                    key={tool.url}
                    value={tool.searchText}
                    onSelect={() => handleSelect(tool.url)}
                  >
                    {Icon && <Icon className="mr-2 h-4 w-4" />}
                    <span>{tool.name}</span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </>
        )}

        {/* Show category groups ONLY when searching */}
        {searchQuery && (
          <>
            {/* Formatters group */}
            <CommandGroup heading="Formatters">
              {SEARCH_INDEX.filter(
                (item) => item.category === "Formatters",
              ).map((tool) => {
                const Icon = getToolIcon(tool);

                return (
                  <CommandItem
                    key={tool.url}
                    value={tool.searchText}
                    onSelect={() => handleSelect(tool.url)}
                  >
                    {Icon && <Icon className="mr-2 h-4 w-4" />}
                    <span>{tool.name}</span>
                  </CommandItem>
                );
              })}
            </CommandGroup>

            {/* Minifiers group */}
            <CommandGroup heading="Minifiers">
              {SEARCH_INDEX.filter((item) => item.category === "Minifiers").map(
                (tool) => {
                  const Icon = getToolIcon(tool);

                  return (
                    <CommandItem
                      key={tool.url}
                      value={tool.searchText}
                      onSelect={() => handleSelect(tool.url)}
                    >
                      {Icon && <Icon className="mr-2 h-4 w-4" />}
                      <span>{tool.name}</span>
                    </CommandItem>
                  );
                },
              )}
            </CommandGroup>

            {/* Encoders group */}
            <CommandGroup heading="Encoders">
              {SEARCH_INDEX.filter((item) => item.category === "Encoders").map(
                (tool) => {
                  const Icon = getToolIcon(tool);

                  return (
                    <CommandItem
                      key={tool.url}
                      value={tool.searchText}
                      onSelect={() => handleSelect(tool.url)}
                    >
                      {Icon && <Icon className="mr-2 h-4 w-4" />}
                      <span>{tool.name}</span>
                    </CommandItem>
                  );
                },
              )}
            </CommandGroup>

            {/* Validators group */}
            <CommandGroup heading="Validators">
              {SEARCH_INDEX.filter(
                (item) => item.category === "Validators",
              ).map((tool) => {
                const Icon = getToolIcon(tool);

                return (
                  <CommandItem
                    key={tool.url}
                    value={tool.searchText}
                    onSelect={() => handleSelect(tool.url)}
                  >
                    {Icon && <Icon className="mr-2 h-4 w-4" />}
                    <span>{tool.name}</span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </>
        )}
      </CommandList>
    </CommandDialog>
  );
}
