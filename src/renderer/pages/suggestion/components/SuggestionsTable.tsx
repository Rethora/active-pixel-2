import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataGrid, GridCellParams, GridColDef } from '@mui/x-data-grid';
import { Box, Card, IconButton } from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ThumbDownOutlinedIcon from '@mui/icons-material/ThumbDownOutlined';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarIcon from '@mui/icons-material/Star';
import StarHalfIcon from '@mui/icons-material/StarHalf';
import usePageContainerSize from '../../../hooks/usePageContainerSize';
import useWindowSize from '../../../hooks/useWindowSize';
import {
  useAddDislikedSuggestionMutation,
  useAddLikedSuggestionMutation,
  useGetAllSuggestionsWithAddPropsQuery,
  useRemoveFeedbackMutation,
} from '../../../slices/suggestionsSlice';

export default function SuggestionsTable() {
  const { data: suggestions = [] } = useGetAllSuggestionsWithAddPropsQuery();
  const [updateLikedSuggestions] = useAddLikedSuggestionMutation();
  const [updateDislikedSuggestions] = useAddDislikedSuggestionMutation();
  const [removeFeedback] = useRemoveFeedbackMutation();
  const navigate = useNavigate();
  const { width } = usePageContainerSize();
  const { height } = useWindowSize();
  const tableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (tableRef.current) {
      tableRef.current.style.width = `${width * 0.9}px`;
      tableRef.current.style.height = `${height * 0.75}px`;
    }
  }, [width, height]);

  const columns = useMemo<GridColDef[]>(
    () => [
      { field: 'name', headerName: 'Name', flex: 2 },
      { field: 'category', headerName: 'Category', width: 100 },
      { field: 'force', headerName: 'Force', width: 65 },
      {
        field: 'level',
        headerName: 'Level',
        width: 65,
        valueGetter: (_, row) => {
          if (row.level === 'beginner') return 1;
          if (row.level === 'intermediate') return 2;
          return 3;
        },
        renderCell: (params) => {
          if (params.value === 1) return <StarBorderIcon />;
          if (params.value === 2) return <StarHalfIcon />;
          return <StarIcon />;
        },
      },
      {
        field: 'primaryMuscles',
        headerName: 'Primary Muscles',
        sortable: false,
        flex: 1,
      },
      {
        field: 'secondaryMuscles',
        headerName: 'Secondary Muscles',
        sortable: false,
        flex: 1,
      },
      { field: 'mechanic', headerName: 'Mechanic', flex: 1 },
      { field: 'equipment', headerName: 'Equipment', flex: 1 },
      {
        field: 'rating',
        headerName: 'Feedback',
        width: 100,
        renderCell: (params) => (
          <Box
            display="flex"
            justifyContent="space-evenly"
            alignItems="center"
            height="100%"
          >
            {/* eslint-disable-next-line no-nested-ternary */}
            {params.row.rating === -1 ? (
              <>
                <IconButton
                  color="primary"
                  onClick={() => removeFeedback(params.row.id)}
                >
                  <ThumbUpIcon />
                </IconButton>
                <IconButton
                  onClick={() => updateDislikedSuggestions(params.row.id)}
                >
                  <ThumbDownOutlinedIcon />
                </IconButton>
              </>
            ) : params.row.rating === 1 ? (
              <>
                <IconButton
                  onClick={() => updateLikedSuggestions(params.row.id)}
                >
                  <ThumbUpOutlinedIcon />
                </IconButton>
                <IconButton
                  color="error"
                  onClick={() => removeFeedback(params.row.id)}
                >
                  <ThumbDownIcon />
                </IconButton>
              </>
            ) : (
              <>
                <IconButton
                  onClick={() => updateLikedSuggestions(params.row.id)}
                >
                  <ThumbUpOutlinedIcon />
                </IconButton>
                <IconButton
                  onClick={() => updateDislikedSuggestions(params.row.id)}
                >
                  <ThumbDownOutlinedIcon />
                </IconButton>
              </>
            )}
          </Box>
        ),
      },
    ],
    [updateLikedSuggestions, updateDislikedSuggestions, removeFeedback],
  );

  const handleOnCellClick = useCallback(
    (params: GridCellParams) => {
      if (params.field !== 'rating') {
        navigate(`/suggestion/${params.row.id}`);
      }
    },
    [navigate],
  );

  return (
    <Card>
      <DataGrid
        ref={tableRef}
        rows={suggestions}
        columns={columns}
        sx={{ cursor: 'pointer', borderRadius: 2 }}
        initialState={{
          pagination: {
            paginationModel: {
              page: 0,
              pageSize: 25,
            },
          },
        }}
        pageSizeOptions={[5, 10, 25, 100]}
        rowSelection={false}
        onCellClick={handleOnCellClick}
      />
    </Card>
  );
}
