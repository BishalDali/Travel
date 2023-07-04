import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../app/store";

interface AuthState {
    isAuthenticated: boolean;
    user :{
        id: string;
        firstName : string;
        lastName : string;
        email : string;
        role : string;
        address : {
            country : string;
            city : string;
            street : string;
            zip : string;
        }
    }
}

const initialState: AuthState = {
    isAuthenticated: localStorage.getItem("user") ? true : false,
    user :{
        id: localStorage.getItem("id")?.toString() || "" ,
        firstName : localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")!).firstName : "",
        lastName : localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")!).lastName : "",
        email : localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")!).email : "",
        role : localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")!).role : "",
        address : {
            country : localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")!).address.country : "",
            city : localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")!).address.city : "",
            street : localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")!).address.street : "",
            zip : localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")!).address.zip : "",
        }
    }
};


export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setAuth: (state, action: PayloadAction<AuthState>) => {
            const { isAuthenticated, user } = action.payload;
            state.isAuthenticated = isAuthenticated;
            state.user = user;
        },
     logout: (state) => {
            state.isAuthenticated = false;
            state.user = {
                id: "",
                firstName : "",
                lastName : "",
                email : "",
                role : "",
                address : {
                    country : "",
                    city : "",
                    street : "",
                    zip : "",
                }
            }
        },


    },
});



export const { setAuth , logout } = authSlice.actions;

export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
export const selectUser = (state: RootState) => state.auth.user;





