import { useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Box, Card, IconButton } from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ThumbDownOutlinedIcon from '@mui/icons-material/ThumbDownOutlined';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarIcon from '@mui/icons-material/Star';
import StarHalfIcon from '@mui/icons-material/StarHalf';
import { getSuggestions } from '../../../../shared/suggestion';
import usePageContainerSize from '../../../hooks/usePageContainerSize';
import useWindowSize from '../../../hooks/useWindowSize';

type SuggestionsTableProps = {
  likedSuggestions: string[];
  dislikedSuggestions: string[];
  handleFeedback: (id: string, feedback: 'liked' | 'disliked' | 'none') => void;
};

export default function SuggestionsTable({
  likedSuggestions,
  dislikedSuggestions,
  handleFeedback,
}: SuggestionsTableProps) {
  const { width } = usePageContainerSize();
  const { height } = useWindowSize();
  const tableRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

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
        field: 'feedback',
        headerName: 'Feedback',
        width: 100,
        renderCell: (params) => (
          <Box
            display="flex"
            justifyContent="space-evenly"
            alignItems="center"
            height="100%"
          >
            {likedSuggestions.includes(params.row.id) ? (
              <IconButton
                color="primary"
                onClick={() => handleFeedback(params.row.id, 'none')}
              >
                <ThumbUpIcon />
              </IconButton>
            ) : (
              <IconButton
                onClick={() => handleFeedback(params.row.id, 'liked')}
              >
                <ThumbUpOutlinedIcon />
              </IconButton>
            )}
            {dislikedSuggestions.includes(params.row.id) ? (
              <IconButton
                color="error"
                onClick={() => handleFeedback(params.row.id, 'none')}
              >
                <ThumbDownIcon />
              </IconButton>
            ) : (
              <IconButton
                onClick={() => handleFeedback(params.row.id, 'disliked')}
              >
                <ThumbDownOutlinedIcon />
              </IconButton>
            )}
          </Box>
        ),
        valueGetter: (_, row) => {
          if (likedSuggestions.includes(row.id)) return -1;
          if (dislikedSuggestions.includes(row.id)) return 1;
          return 0;
        },
      },
    ],
    [likedSuggestions, dislikedSuggestions, handleFeedback],
  );

  const rows = useMemo(() => getSuggestions(), []);

  return (
    <Card>
      <DataGrid
        ref={tableRef}
        rows={rows}
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
        onCellClick={(params) => {
          if (params.field !== 'feedback') {
            navigate(`/suggestion/get`, {
              state: {
                suggestion: params.row,
              },
            });
          }
        }}
      />
    </Card>
  );
}
