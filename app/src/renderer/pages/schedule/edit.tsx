import { useParams } from 'react-router-dom';
import ScheduleForm from './form';
import Loading from '../../components/Loading';
import { useGetScheduleQuery } from '../../slices/schedulesSlice';

export default function EditSchedulePage() {
  const { id } = useParams();
  const { data: schedule, isLoading, isError } = useGetScheduleQuery(id ?? '');

  if (!id || !schedule) return <div>No schedule found</div>;
  if (isLoading) return <Loading />;
  if (isError) return <div>Error</div>;

  return <ScheduleForm method="PUT" schedule={schedule} id={id} />;
}
