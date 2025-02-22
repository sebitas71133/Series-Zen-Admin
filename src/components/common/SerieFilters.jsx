import { FilterList } from "@mui/icons-material";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import React from "react";

const SerieFilters = () => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        mb: 4,
      }}
    >
      <Typography variant="h5" component="h1">
        Products
      </Typography>
      <Box sx={{ display: "flex", gap: 2 }}>
        <Button
          startIcon={<FilterList />}
          variant="outlined"
          sx={{ borderRadius: 2 }}
        >
          Filters
        </Button>
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Sort By</InputLabel>
          <Select value="featured" label="Sort By" sx={{ borderRadius: 2 }}>
            <MenuItem value="featured">Featured</MenuItem>
            <MenuItem value="newest">Newest</MenuItem>
            <MenuItem value="price_low">Price: Low-High</MenuItem>
            <MenuItem value="price_high">Price: High-Low</MenuItem>
          </Select>
        </FormControl>
      </Box>
    </Box>
  );
};

export default SerieFilters;
