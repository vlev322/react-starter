import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

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
import { StarWarsPerson, useGetPeopleQuery } from '@/state/starWars/starWarsApiSlice';

const StarWarsPeoplePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [page, setPage] = useState(1);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const pageParam = params.get('page');
    if (pageParam) {
      setPage(parseInt(pageParam, 10));
    }
  }, [location.search]);

  const {
    data: peopleData,
    isLoading,
    isError,
  } = useGetPeopleQuery({ page });

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    navigate(`?page=${newPage}`);
  };

  if (isError) {
    return <div>Error loading Star Wars people data...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Star Wars People</h1>
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(10)].map((_, index) => (
            <Card key={index}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-1/2 mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
              href={`?page=${page - 1}`}
              onClick={(e) => {
                e.preventDefault();
                if (page > 1) handlePageChange(page - 1);
              }}
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
              href={`?page=${page + 1}`}
              onClick={(e) => {
                e.preventDefault();
                if (peopleData?.next) handlePageChange(page + 1);
              }}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default StarWarsPeoplePage;
