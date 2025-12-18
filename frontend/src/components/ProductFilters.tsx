/**
 * ProductFilters Component
 * Sidebar with tag-based filtering
 */

'use client';

import { Box, Typography, Checkbox, Button, Sheet } from '@mui/joy';
import { Product, Filters } from '@/types';

interface ProductFiltersProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
  products: Product[];
}

export default function ProductFilters({
  filters,
  onFiltersChange,
  products,
}: ProductFiltersProps) {
  // Extract unique values from products
  const uniqueTracks = Array.from(
    new Set(products.map((p) => p.tags.track).filter(Boolean))
  ) as string[];

  const uniqueProductTypes = Array.from(
    new Set(products.map((p) => p.tags.productType))
  );

  const uniqueCreators = Array.from(
    new Set(products.map((p) => p.tags.creator).filter(Boolean))
  ) as string[];

  const handleTrackToggle = (track: string) => {
    const newTracks = filters.tracks.includes(track)
      ? filters.tracks.filter((t) => t !== track)
      : [...filters.tracks, track];

    onFiltersChange({ ...filters, tracks: newTracks });
  };

  const handleProductTypeToggle = (type: string) => {
    const newTypes = filters.productTypes.includes(type)
      ? filters.productTypes.filter((t) => t !== type)
      : [...filters.productTypes, type];

    onFiltersChange({ ...filters, productTypes: newTypes });
  };

  const handleCreatorToggle = (creator: string) => {
    const newCreators = filters.creators.includes(creator)
      ? filters.creators.filter((c) => c !== creator)
      : [...filters.creators, creator];

    onFiltersChange({ ...filters, creators: newCreators });
  };

  const clearAllFilters = () => {
    onFiltersChange({ tracks: [], productTypes: [], creators: [] });
  };

  const hasActiveFilters =
    filters.tracks.length > 0 ||
    filters.productTypes.length > 0 ||
    filters.creators.length > 0;

  return (
    <Sheet
      variant="outlined"
      sx={{
        p: 2,
        borderRadius: 'sm',
        position: 'sticky',
        top: 100,
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography level="title-md" sx={{ fontWeight: 'bold' }}>
          Filters
        </Typography>
        {hasActiveFilters && (
          <Button size="sm" variant="plain" onClick={clearAllFilters}>
            Clear All
          </Button>
        )}
      </Box>

      {/* Track Filter */}
      <Box sx={{ mb: 3 }}>
        <Typography level="title-sm" sx={{ mb: 1 }}>
          Track
        </Typography>
        {uniqueTracks.sort().map((track) => (
          <Box key={track} sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
            <Checkbox
              size="sm"
              label={track}
              checked={filters.tracks.includes(track)}
              onChange={() => handleTrackToggle(track)}
            />
          </Box>
        ))}
      </Box>

      {/* Product Type Filter */}
      <Box sx={{ mb: 3 }}>
        <Typography level="title-sm" sx={{ mb: 1 }}>
          Product Type
        </Typography>
        {uniqueProductTypes.sort().map((type) => (
          <Box key={type} sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
            <Checkbox
              size="sm"
              label={type}
              checked={filters.productTypes.includes(type)}
              onChange={() => handleProductTypeToggle(type)}
            />
          </Box>
        ))}
      </Box>

      {/* Creator Filter */}
      <Box sx={{ mb: 3 }}>
        <Typography level="title-sm" sx={{ mb: 1 }}>
          Creator
        </Typography>
        {uniqueCreators.sort().map((creator) => (
          <Box key={creator} sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
            <Checkbox
              size="sm"
              label={creator}
              checked={filters.creators.includes(creator)}
              onChange={() => handleCreatorToggle(creator)}
            />
          </Box>
        ))}
      </Box>
    </Sheet>
  );
}
