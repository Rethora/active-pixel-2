import { useParams } from 'react-router-dom';
import Loading from '../../components/Loading';
import { useGetDoNotDisturbScheduleQuery } from '../../slices/doNotDisturbSchedulesSlice';
import DoNotDisturbForm from './components/DoNotDisturbForm';

export default function EditDoNotDisturbPage() {
  const { id = '' } = useParams();
  const { data: schedule, isLoading } = useGetDoNotDisturbScheduleQuery(id);

  if (isLoading) {
    return <Loading />;
  }

  if (!schedule) {
    return <div>Schedule not found</div>;
  }

  return <DoNotDisturbForm method="PUT" schedule={schedule} id={id} />;
}
