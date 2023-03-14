import {useQuery} from "react-query";
import {Match} from "./hooks";
import {Table, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";

export default function MatchesTable() {
  const {
    isLoading,
    data,
    error,
  } = useQuery<Match[]>(`matches`, async () => {
    const response = await fetch(`/api/getMatches`);
    const data = await response.json();
    return data.matches;
  });

  if (isLoading) {
    return <div>Loading matches...</div>;
  }
  if(error) {
    return <div>Error loading matches</div>;
  }
  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Seller Name</TableCell>
            <TableCell>Buyer Name</TableCell>
            <TableCell>Pet Name</TableCell>
          </TableRow>
        </TableHead>
        {data?.map((match) => (
          <TableRow key={match.pet.id}>
            <TableCell>{match.owner.surname} {match.owner.name}({match.owner.email})</TableCell>
            <TableCell>{match.buyer.surname} {match.buyer.name}({match.buyer.email})</TableCell>
            <TableCell>{match.pet.name}</TableCell>
          </TableRow>
        ))}
      </Table>
    </TableContainer>
  );
}
