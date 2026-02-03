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
import { getCategoriesByOrder } from "@/lib/tools-data";

interface CommandMenuProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

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

  // Get tool icon from SearchableToolItem (already includes icon)
  const getToolIcon = (tool: SearchableToolItem) => {
    return tool.icon;
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
        {searchQuery &&
          getCategoriesByOrder().map((category) => (
            <CommandGroup key={category.id} heading={category.label}>
              {SEARCH_INDEX.filter((item) => item.category === category.id).map(
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
          ))}
      </CommandList>
    </CommandDialog>
  );
}
