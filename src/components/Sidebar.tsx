import { Avatar, Box, Flex, Icon, IconButton, Input, InputGroup, InputLeftElement, Text } from '@chakra-ui/react';
import { FiMenu, FiSearch, FiBell } from 'react-icons/fi';

import { Drawer, DrawerContent, DrawerOverlay, useDisclosure } from '@chakra-ui/react';
import { MdArrowBackIosNew, MdHome } from 'react-icons/md';
import {IoMdAdd} from 'react-icons/io';
import { Link, Outlet } from 'react-router-dom';
import { useAppSelector } from '../features/app/store';
import { selectUser } from '../features/auth/authSlice';
import { backIn } from 'framer-motion';

const Sidebar = () => {
    const sidebar = useDisclosure();
    const user = useAppSelector(selectUser);
    const { firstName, lastName } = user;


    const NavItem = (props: any) => {
      const { icon, children, ...rest } = props;
      return (
        <Flex
          align="center"
          px="4"
          mx="2"
          rounded="md"
          py="3"
          cursor="pointer"
          color="whiteAlpha.700"
          _hover={{
            bg: "blackAlpha.300",
            color: "whiteAlpha.900",
          }}
          role="group"
          fontWeight="semibold"
          transition=".15s ease"
          {...rest}
        >
          {icon && (
            <Icon
              mr="2"
              boxSize="4"
              _groupHover={{
                color: "gray.300",
              }}
              as={icon}
            />
          )}
          
          {children}
        </Flex>
      );
    };
  
    const SidebarContent = (props: any) => (
      <Box
        as="nav"
        pos="fixed"
        top="0"
        left="0"
        zIndex="sticky"
        h="full"
        pb="10"
        overflowX="hidden"
        overflowY="auto"
        bg="blue.800"
        borderColor="blackAlpha.300"
        borderRightWidth="1px"
        w="60"
        {...props}
      >
        <Flex px="4" py="5" align="center">
          <Text fontSize="2xl" ml="2" color="white" fontWeight="semibold">
            Travel Admin
          </Text>
        </Flex>
        <Flex
          direction="column"
          as="nav"
          fontSize="sm"
          color="gray.600"
          aria-label="Main Navigation"
        >
          <Link to = "/admin" >
          <NavItem icon={MdHome}>Home</NavItem>
          </Link>
          <Link to ="/admin/addtrip">
          <NavItem icon= {IoMdAdd}>Add Trips</NavItem>
          </Link>
          <Link to ="/">
          <NavItem icon= {MdArrowBackIosNew}>Back to website</NavItem>
          </Link>
        </Flex>
      </Box>
    );
  
    return (
      <Box
        as="section"
        bg="gray.50"
        _dark={{
          bg: "gray.700",
        }}
        minH="100vh"
      >
        <SidebarContent
          display={{
            base: "none",
            md: "unset",
          }}
        />
        <Drawer
          isOpen={sidebar.isOpen}
          onClose={sidebar.onClose}
          placement="left"
        >
          <DrawerOverlay />
          <DrawerContent>
            <SidebarContent w="full" borderRight="none" />
          </DrawerContent>
        </Drawer>
        <Box
          ml={{
            base: 0,
            md: 60,
          }}
          transition=".3s ease"
        >
          <Flex
            as="header"
            align="center"
            justify="space-between"
            w="full"
            px="4"
            bg="white"
            _dark={{
              bg: "gray.800",
            }}
            borderBottomWidth="1px"
            borderColor="blackAlpha.300"
            h="14"
          >
            <IconButton
              aria-label="Menu"
              display={{
                base: "inline-flex",
                md: "none",
              }}
              onClick={sidebar.onOpen}
              icon={<FiMenu />}
              size="sm"
            />
            <InputGroup
              w="96"
              display={{
                base: "none",
                md: "flex",
              }}
            >
              <InputLeftElement color="gray.500">
                <FiSearch />
              </InputLeftElement>
              <Input  />
            </InputGroup>
  
            <Flex align="center">
              <Icon color="gray.500" as={FiBell} cursor="pointer" />
              <Avatar
                ml="4"
                size="sm"
                name={`${firstName} ${lastName}`}
                cursor="pointer"
              />
            </Flex>
          </Flex>
  
          <Box as="main" p="4">
            <Outlet />
          </Box>
        </Box>
      </Box>
    );
  };

export default Sidebar;
