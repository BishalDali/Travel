import { Outlet } from "react-router-dom";
import { useAppSelector } from "./features/app/store";
import { selectIsAuthenticated, selectUser } from "./features/auth/authSlice";

const ProtectedLayout = () => {

    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    const user = useAppSelector(selectUser)

    if (isAuthenticated === undefined) {
        return <h1>Loading...</h1>;
    }


    return(
        isAuthenticated && user.role ==="admin" ? (
            <Outlet />
        ) : (
            <h1>Not authorized</h1>
        )
    )

};


export default ProtectedLayout;