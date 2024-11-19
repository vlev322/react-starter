import { useLocation } from 'react-router-dom';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Skeleton } from '@/components/ui/skeleton';
import {
  StarWarsPerson,
  useGetPeopleQuery,
} from '@/state/starWars/starWarsApiSlice';

const StarWarsPeoplePage = () => {
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const page = Number(searchParams.get('page')) || 1;

  const {
    data: peopleData,
    isLoading,
    isFetching,
    isError,
  } = useGetPeopleQuery({ page });

  if (isError) {
    return <div>Error loading Star Wars people data...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-6 text-3xl font-bold">Star Wars People</h1>
      {isLoading && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(10)].map((_, index) => (
            <Card key={index} className="w-52">
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
      {isFetching ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(10)].map((_, index) => (
            <Card key={index} className="w-52">
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="mb-2 h-4 w-1/2" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {peopleData?.results.map((person: StarWarsPerson) => (
            <Card key={person.name}>
              <CardHeader>
                <CardTitle>{person.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Born: {person.birth_year}</p>
                <p>Gender: {person.gender}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      <Pagination className="mt-6">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href={peopleData?.previous ? `?page=${page - 1}` : '#'}
            />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">{page}</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext
              href={peopleData?.next ? `?page=${page + 1}` : '#'}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default StarWarsPeoplePage;
