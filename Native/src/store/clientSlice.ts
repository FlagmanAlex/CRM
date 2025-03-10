import { createAsyncThunk, createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import { host, port } from "../Default";
import { IClient } from "../../../Interfaces/IClient";

const server = `${host}:${port}`

const clientAdapter = createEntityAdapter<IClient, string>({
    selectId: client => client._id!
})

const initialState = clientAdapter.getInitialState({
    status: 'idle' as 'idle' | "loading" | "succeeded" | "failed", // Состояние загрузки
    error: null as string | null, // Сообщение об ошибке
})


export const updateClient = createAsyncThunk<
    IClient,            //Возвращаемый тип ( response Client )
    IClient,            //Тип входного параметра ( newClient )
    { rejectValue: string }   //Настройка ( тип ошибки )
>(
    'client/updateClient',
    async (updateClient, { rejectWithValue }) => {
        try {
            const response = await fetch('', {
                method: 'PUT',
                headers:{'Content-Type':'application/json'},
                body: JSON.stringify(updateClient)
            })  

            if (!response.ok) {
                const errorMessage = `${response.status} ${response.statusText}`;
                throw new Error(errorMessage);
            }
            
            const data = await response.json()
            return data
        } catch (error) {
            const errorMessage = error instanceof Error
                ? error.message
                : typeof error === "string"
                    ? error
                    : "Неизвестная ошибка"
            return rejectWithValue(errorMessage);
        }
    }
)
export const addClient = createAsyncThunk<
    IClient,            //Возвращаемый тип ( response Client )
    IClient,            //Тип входного параметра ( newClient )
    { rejectValue: string }   //Настройка ( тип ошибки )
>(
    'client/addClient',
    async (newClient, { rejectWithValue }) => {
        try {
            const response = await fetch(`${server}/api/client`, {
                method: 'POST',
                body: JSON.stringify(newClient),
                headers: { 'Content-Type': 'application/json' }
            })

            if (!response.ok) {
                const errorMessage = `${response.status} ${response.statusText}`;
                throw new Error(errorMessage);
            }

            const data: IClient = await response.json()
            return data
        } catch (error) {
            const errorMessage = error instanceof Error
                ? error.message
                : typeof error === "string"
                    ? error
                    : "Неизвестная ошибка"
            return rejectWithValue(errorMessage);
        }
    }
)

const clientSlice = createSlice({
    name: 'client',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(addClient.fulfilled, (state, action) => {
            state.status = 'succeeded',
            clientAdapter.addOne(state, action.payload)
        })
        .addCase(updateClient.fulfilled, (state, action) => {
            state.status = 'succeeded'
            clientAdapter.updateOne(state, {id:action.payload._id!, changes: action.payload})
        })
    }
})

export default clientSlice.reducer