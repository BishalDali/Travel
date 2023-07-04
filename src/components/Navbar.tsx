import {
  Box,
  Flex,
  Spacer,
  IconButton,
  Image,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import { FiMenu } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../features/app/store";
import {
  selectIsAuthenticated,
  selectUser,
  logout,
} from "../features/auth/authSlice";
import { useLogoutMutation } from "../features/auth/authApiSlice";

const Navbar = () => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const [logoutMutation] = useLogoutMutation();
  const user = useAppSelector(selectUser);
  const { role } = user;
  const dispatch = useAppDispatch();

  const handleLogout = async () => {
    localStorage.removeItem("user");
    localStorage.removeItem("id");
    //@ts-ignore
    await logoutMutation();
    dispatch(logout());
  };


  return (
    <Box bg="white" boxShadow="md" px={4} py={3}>
      <Flex alignItems="center">
        <Image src="/Images/Logo.jpg" alt="Logo" w={10} h={10} />

        <Spacer />

        <Box display={{ base: "none", md: "block" }}>
          <Link to="/">
          <Button variant="ghost" size="sm" mr={4}>
            Home
          </Button>
          </Link>
          <Button variant="ghost" size="sm" mr={4} disabled
            _hover={{
              cursor: "not-allowed",
              textDecoration: "none",
              color: "black",
            }}
          >
            Destinations
          </Button>
          <Button variant="ghost" size="sm" mr={4}
                _hover={{
                  cursor: "not-allowed",
                  textDecoration: "none",
                  color: "black",
                }}
          >
            Packages
          </Button>
          <Button variant="ghost" size="sm"
                _hover={{
                  cursor: "not-allowed",
                  textDecoration: "none",
                  color: "black",
                }}
          >
            Blog
          </Button>
        </Box>

        <Spacer />

        <Box display={{ base: "block", md: "none" }}>
          <Menu isLazy>
            <MenuButton
              as={IconButton}
              icon={<FiMenu />}
              variant="ghost"
              size="sm"
              mr={4}
              aria-label="Navigation Menu"
            />
            <MenuList>
              <Link to="/">
              <MenuItem>Home</MenuItem>
              </Link>
              <MenuItem>Destinations</MenuItem>
              <MenuItem>Packages</MenuItem>
              <MenuItem>Blog</MenuItem>
            </MenuList>
          </Menu>
        </Box>
        {role === "admin" && (
          <Link to="/admin">
            <Button size="sm" ml={4}>
              Dashboard
            </Button>
          </Link>
        )}
        {isAuthenticated ? (
          <Button size="sm" ml={4} onClick={handleLogout}>
            Log out
          </Button>
        ) : (
          <>
            <Link to="/login">
              <Button size="sm" ml={4}>
                Sign In
              </Button>
            </Link>
            <Link to="/register">
              <Button colorScheme="teal" size="sm" ml={4}>
                Sign Up
              </Button>
            </Link>
          </>
        )}
      </Flex>
    </Box>
  );
};

export default Navbar;
