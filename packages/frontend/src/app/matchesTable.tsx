import { useQuery } from 'react-query';
import { Match } from './hooks';
import {
  Paper,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import TablePaginationActions from '@mui/material/TablePagination/TablePaginationActions';

export default function MatchesTable() {
  const { isLoading, data, error } = useQuery<Match[]>(`matches`, async () => {
    const response = await fetch(`/api/getMatches`);
    const data = await response.json();
    return data.matches;
  });

  if (isLoading) {
    return <div>Loading matches...</div>;
  }
  if (error) {
    return <div>Error loading matches</div>;
  }
  return (
    <>
      <Typography
        variant="overline"
        sx={{
          mt: 10,
        }}
      >
        Your Matches
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Seller Name</TableCell>
              <TableCell>Buyer Name</TableCell>
              <TableCell>Pet Name</TableCell>
            </TableRow>
          </TableHead>
          {data?.filter(s => s != null).map((match) => (
            <TableRow key={match.owner.pet?.id}>
              <TableCell>
                {match.owner.surname} {match.owner.name}({match.owner.email})
              </TableCell>
              <TableCell>
                {match.buyer.surname} {match.buyer.name}({match.buyer.email})
              </TableCell>
              <TableCell>
                {match.owner.pet?.name}
                <img width={20} src={match.owner.pet?.profile_picture}/>
              </TableCell>
            </TableRow>
          ))}
        </Table>
      </TableContainer>
    </>
  );
}
