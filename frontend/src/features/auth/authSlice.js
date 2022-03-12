import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import authService from './authService'

// Get user from local storage

const getUser = () => {
    const data = localStorage.getItem('user')
    let user = null
    if (data) {
        user = JSON.parse(data)
    }

    return user
}

const initialState = {
    user: getUser(),
    isError: false,
    isSuccess: false,
    isLoading: false,
    meaage: ''
}

// Register user

export const register = createAsyncThunk('auth/register',
    async (user, thunkAPI) => {
        try {
            return await authService.register(user)

        } catch (error) {
            const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
            return thunkAPI.rejectWithValue(message)
        }
    })

//login
export const login = createAsyncThunk('auth/login',
    async (user, thunkAPI) => {
        try {
            return await authService.login(user)

        } catch (error) {
            const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
            return thunkAPI.rejectWithValue(message)
        }
    })


export const logout = createAsyncThunk('auth/logout',
    async () => {
        return await authService.logout()
    })
export const authSlice = createSlice(
    {
        name: 'auth',
        initialState,
        reducers: {
            reset: (state) => {
                state.isLoaing = false
                state.isSuccess = false
                state.isError = false
                state.message = ''
            }
        },
        extraReducers: (builder) => {
            builder
                .addCase(register.pending, (state) => {
                    state.isLoading = true
                })
                .addCase(register.fulfilled, (state, action) => {
                    state.isLoading = false
                    state.isSuccess = true
                    state.user = action.payload
                })
                .addCase(register.rejected, (state, action) => {
                    state.isLoading = false
                    state.isError = true
                    state.meaage = action.payload
                    state.user = null
                })
                .addCase(login.pending, (state) => {
                    state.isLoading = true
                })
                .addCase(login.fulfilled, (state, action) => {
                    state.isLoading = false
                    state.isSuccess = true
                    state.user = action.payload
                })
                .addCase(login.rejected, (state, action) => {
                    state.isLoading = false
                    state.isError = true
                    state.meaage = action.payload
                    state.user = null
                })
                .addCase(logout.fulfilled, (state) => {
                    state.user = null
                })
        }
    }
)
export const { reset } = authSlice.actions
export default authSlice.reducer