import { useState, useEffect, useRef } from 'react';
import {
  Box,
  Container,
  Stack,
  Text,
  Image,
  Flex,
  VStack,
  Button,
  Heading,
  SimpleGrid,
  StackDivider,
  useColorModeValue,
  List,
  ListItem,
  Spinner,
  useToast,
} from '@chakra-ui/react';
import { useGetTripQuery, useAddToFavouritesMutation, useRemoveFromFavouritesMutation } from '../trip/tripApiSlice';
import { useNavigate, useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import { useAppSelector } from '../app/store';
import { selectUser } from '../auth/authSlice';




type TripCount = {
  tripId: string;
  count: number;
};

export default function PackageDetail() {
  const { id } = useParams<{ id: string }>(); 

  const { data: trip, isError, isLoading } = useGetTripQuery(id, { skip: !id });
  const [addToFavorites] = useAddToFavouritesMutation();
  const [removeFromFavorites] = useRemoveFromFavouritesMutation();
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [favoriteCount, setFavoriteCount] = useState<number>(0);
  const socket = useRef<any>()
  const toast = useToast()
  const navigate = useNavigate()

  const user = useAppSelector(selectUser);
  
  useEffect(() => {
    if (user.id && trip?.data?.favoritesBy.includes(user.id)) {
      setIsFavorite(true);
    }
  }, [user.id, trip?.data?.favoritesBy]);


  useEffect(() => {
    

    socket.current = io('http://localhost:8000');



    socket.current.on('favoriteCount', (data: TripCount[]) => {

      
        const count = data.find((trip) => trip.tripId === id)?.count;
        setFavoriteCount(count || 0);

    });
    

      

    return () => {
      socket.current.disconnect();
    };
  }, [id]);

  

const handleAddToFavorites = async () => {
   
    try {
      await addToFavorites(id).unwrap();
      socket.current.emit("addToFavorites", id);
      toast({
        title: "Added to favorites",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top-right"
      })
    } catch (error) {
      const { data } = error as { data: { message: string, statusCode: number } };
      if(data.statusCode === 401) {
        navigate('/login')
        toast({
          title: data.message,
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top-right"
        })
      }
    
    }

}

  const handleRemoveFromFavorites = async () => {
    socket.current.emit("removeFromFavorites", id);
    try {
      await removeFromFavorites(id).unwrap();
      toast({
        title: "Removed from favorites",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top-right"
      })
    } catch (error) {
      const { data } = error as { data: { message: string, statusCode: number } };
      if(data.statusCode === 401) {
        navigate('/login')
        toast({
          title: data.message,
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top-right"
        })
      }
    }
  }



const handleFavorite= () => {
  if (isFavorite) {
    handleRemoveFromFavorites();
    setIsFavorite(false);
  } else {
    handleAddToFavorites();
    setIsFavorite(true);
  }
};


  

  if (isError) {
    return <Text>Page Not Found</Text>;
  }

  return (
    <Container maxW={'7xl'}>
      {isLoading && (
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="blue.500"
          size="xl"
          left={'50%'}
          top={'50%'}
          position={'absolute'}
          transform={'translate(-50%, -50%)'}
        />
      )}
      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={{ base: 8, md: 10 }} py={{ base: 18, md: 24 }}>
        <Flex>
          <Image
            rounded={'md'}
            alt={'product image'}
            src={trip?.data?.photos[0]}
            fit={'cover'}
            align={'center'}
            w={'100%'}
            h={{ base: '100%', sm: '400px', lg: '500px' }}
          />
        </Flex>
        <Stack spacing={{ base: 6, md: 10 }}>
          <Box as={'header'}>
            <Heading lineHeight={1.1} fontWeight={600} fontSize={{ base: '2xl', sm: '4xl', lg: '5xl' }}>
              {trip?.data?.title}
            </Heading>
            <Text color={useColorModeValue('gray.900', 'gray.400')} fontWeight={300} fontSize={'2xl'}>
              Nrs. {trip?.data?.budget}
            </Text>
          </Box>

          <Stack
            spacing={{ base: 4, sm: 6 }}
            direction={'column'}
            divider={<StackDivider borderColor={useColorModeValue('gray.200', 'gray.600')} />}
          >
            <VStack spacing={{ base: 4, sm: 6 }}>
              <Text
                color={useColorModeValue('gray.500', 'gray.400')}
                fontSize={'2xl'}
                fontWeight={'300'}
              >
                {trip?.data?.description}
              </Text>
            </VStack>
            <Box>
              <Text
                fontSize={{ base: '16px', lg: '18px' }}
                color={useColorModeValue('yellow.500', 'yellow.300')}
                fontWeight={'500'}
                textTransform={'uppercase'}
                mb={'4'}
              >
                Details
              </Text>

              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
                <List spacing={2}>
                  <ListItem>
                    <Text as={'span'} fontWeight={'bold'}>
                      Location :
                    </Text>{' '}
                    {trip?.data?.location}
                  </ListItem>
                  <ListItem>
                    <Text as={'span'} fontWeight={'bold'}>
                      Start Date:
                    </Text>{' '}
                    {trip?.data?.startDate.split('T')[0]}
                  </ListItem>
                  <ListItem>
                    <Text as={'span'} fontWeight={'bold'}>
                      End Date:
                    </Text>{' '}
                    {trip?.data?.endDate.split('T')[0]}
                  </ListItem>
                </List>
              </SimpleGrid>
            </Box>
            <Box>
              <Text
                fontSize={{ base: '16px', lg: '18px' }}
                color={useColorModeValue('yellow.500', 'yellow.300')}
                fontWeight={'500'}
                textTransform={'uppercase'}
                mb={'4'}
              >
                Transportation
              </Text>

              <List spacing={2}>
                <ListItem>
                  <Text as={'span'} fontWeight={'bold'}>
                    Name:
                  </Text>{' '}
                  {trip?.data?.transportation[0]?.name}
                </ListItem>
                <ListItem>
                  <Text as={'span'} fontWeight={'bold'}>
                    Description:
                  </Text>{' '}
                  {trip?.data?.transportation[0]?.description}
                </ListItem>
              </List>
            </Box>
            {trip?.data?.accommodation?.length > 0 && (
              <Box>
                <Text
                  fontSize={{ base: '16px', lg: '18px' }}
                  color={useColorModeValue('yellow.500', 'yellow.300')}
                  fontWeight={'500'}
                  textTransform={'uppercase'}
                  mb={'4'}
                >
                  Accommodation
                </Text>

                <List spacing={2}>
                  <ListItem>
                    <Text as={'span'} fontWeight={'bold'}>
                      Name:
                    </Text>{' '}
                    {trip?.data?.accommodation[0]?.name}
                  </ListItem>
                  <ListItem>
                    <Text as={'span'} fontWeight={'bold'}>
                      Address:
                    </Text>{' '}
                    {trip?.data?.accommodation[0]?.address}
                  </ListItem>
                  <ListItem>
                    <Text as={'span'} fontWeight={'bold'}>
                      Check In:
                    </Text>{' '}
                    {trip?.data?.accommodation[0]?.checkIn}
                  </ListItem>
                  <ListItem>
                    <Text as={'span'} fontWeight={'bold'}>
                      Check Out:
                    </Text>{' '}
                    {trip?.data?.accommodation[0]?.checkOut}
                  </ListItem>
                </List>
              </Box>
            )}

            {trip?.data?.accommodation?.length > 1 && (
              <Box>
                <Text
                  fontSize={{ base: '16px', lg: '18px' }}
                  color={useColorModeValue('yellow.500', 'yellow.300')}
                  fontWeight={'500'}
                  textTransform={'uppercase'}
                  mb={'4'}
                >
                  Activities
                </Text>

              </Box>
            )}
          </Stack>

          <Button
            onClick={handleFavorite}
            rounded={'none'}
            w={'full'}
            mt={8}
            size={'lg'}
            py={'7'}
            bg={useColorModeValue('gray.900', 'gray.50')}
            color={useColorModeValue('white', 'gray.900')}
            textTransform={'uppercase'}
            _hover={{
              transform: 'translateY(2px)',
              boxShadow: 'lg',
            }}
               
          >
            {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
          </Button>

          <Stack direction="row" alignItems="center" justifyContent={'center'}>
            <Text>
              {favoriteCount && favoriteCount} people have added this trip to their 
              {' '}
              <Text as={'span'} fontWeight={'bold'} color={'yellow.500'}>
                {' '}
                favorites.
                </Text> 
            </Text>
          </Stack>
        </Stack>
      </SimpleGrid>
    </Container>
  );
}
