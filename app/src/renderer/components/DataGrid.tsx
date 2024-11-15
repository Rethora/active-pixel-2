import { useEffect, useRef } from 'react';
import { DataGridProps, DataGrid as DefaultDataGrid } from '@mui/x-data-grid';
import { Card, CardProps } from '@mui/material';
import usePageContainerSize from '../hooks/usePageContainerSize';
import { APP_WITH_BREADCRUMBS_AND_TITLE_HEIGHT } from '../constants/app';
import useWindowSize from '../hooks/useWindowSize';

type Props = {
  muiDataGridProps: DataGridProps;
  cardProps?: CardProps;
  heightSubtraction?: number;
  autoHeight?: boolean;
  autoWidth?: boolean;
};

export default function DataGrid({
  muiDataGridProps,
  cardProps,
  heightSubtraction,
  autoHeight = true,
  autoWidth = true,
}: Props) {
  const dataGridRef = useRef<HTMLDivElement>(null);
  const { width } = usePageContainerSize();
  const { height } = useWindowSize();

  useEffect(() => {
    if (dataGridRef.current) {
      if (autoWidth) {
        dataGridRef.current.style.width = `${width * 0.85}px`;
      }
      if (autoHeight) {
        dataGridRef.current.style.height = `${
          (height -
            APP_WITH_BREADCRUMBS_AND_TITLE_HEIGHT -
            (heightSubtraction ?? 0)) *
          0.85
        }px`;
      }
    }
  }, [width, height, heightSubtraction, autoWidth, autoHeight]);

  return (
    <Card
      sx={{ width: 'fit-content', height: 'fit-content', ...cardProps?.sx }}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...cardProps}
    >
      <DefaultDataGrid
        ref={dataGridRef}
        pageSizeOptions={[5, 10, 25]}
        initialState={{
          pagination: {
            paginationModel: {
              page: 0,
              pageSize: 25,
            },
          },
        }}
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...muiDataGridProps}
      />
    </Card>
  );
}
