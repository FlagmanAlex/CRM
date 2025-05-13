import { createAsyncThunk, createEntityAdapter, createSlice, isRejectedWithValue } from "@reduxjs/toolkit";
import { IPayment } from '../../../Interfaces/IPayment'
import { host, port } from "../Default";
import { RootState } from ".";

const server = `${host}:${port}`;

const paymentAdapter = createEntityAdapter<IPayment, string>({
    selectId: (payment) => payment._id!,
    sortComparer: (a, b) => a.date.toString().localeCompare(b.date.toString(), undefined, { numeric: true })
})

const initialState = paymentAdapter.getInitialState({
    status: 'idle' as 'idle' | 'loading' | 'succeeded' | 'failed',
    error: null as string | null, // Сообщение об ошибке
})

export const fetchPayments = createAsyncThunk<
    IPayment[], //Возвращаемый тип ( IPayment )
    void, //Тип входного параметра ( orderId )
    { rejectValue: string } //Настройка ( тип ошибки )
>(
    'payment/fetchPayment',
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetch(`${server}/api/payment`);
            if (!response.ok) {
                const errorMessage = `${response.status} ${response.statusText}`;
                throw new Error(errorMessage);
            }
            const data: IPayment[] = await response.json();
            return data;
        } catch (error) {
            let errorMessage = "Неизвестная ошибка";
            if (error instanceof Error) {
                errorMessage = error.message;
            } else if (typeof error === "string") {
                errorMessage = error;
            }
            return rejectWithValue(errorMessage);
        }
    }
)

export const createPayment = createAsyncThunk<
    IPayment, //Возвращаемый тип ( newPayment )
    IPayment, //Тип входного параметра (Payment) 
    { rejectValue: string } //Настройка ( тип ошибки )    
>(
    'payment/createPayment',
    async (newPayment, { rejectWithValue }) => {
        try {

            const response = await fetch(`${server}/api/payment`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newPayment)
            })

            if (!response.ok) {
                const errorMessage = `${response.status} ${response.statusText}`;
                throw new Error(errorMessage);
            }

            const data: IPayment = await response.json()
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

export const updatePayment = createAsyncThunk<
    IPayment, //Возвращаемый тип ( newPayment )
    IPayment, //Тип входного параметра (updatePayment) 
    { rejectValue: string } //Настройка ( тип ошибки )    
>(
    'payment/updatePayment',
    async (updatePayment, { rejectWithValue }) => {
        try {
            const response = await fetch(`${server}/api/payment/${updatePayment._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatePayment)
            })

            if (!response.ok) {
                const errorMessage = `${response.status} ${response.statusText}`;
                throw new Error(errorMessage);
            }

            const data: IPayment = await response.json()
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

export const deletePayment = createAsyncThunk<
    string, //Возвращаемый тип ( id удаленного объекта )
    string, //Тип входного параметра ( PaymentId )
    { rejectValue: string } //Настройка ( тип ошибки )
>(
    'orderItem/deleteOrderItem',
    async (paymentId, { rejectWithValue }) => {
        console.log('Есть вход в orderItem/deleteOrderItem');

        try {
            const response = await fetch(`${server}/api/payment/${paymentId}`, {
                method: 'DELETE',
            })

            if (!response.ok) {
                const errorMessage = `${response.status} ${response.statusText}`;
                throw new Error(errorMessage);
            }

            return paymentId

        } catch (error) {
            let errorMessage = "Неизвестная ошибка";
            if (error instanceof Error) {
                errorMessage = error.message;
            } else if (typeof error === "string") {
                errorMessage = error;
            }
            return rejectWithValue(errorMessage);
        }
    }
)



const paymentSlice = createSlice({
    name: 'payment',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchPayments.pending, (state) => {
                state.status = 'loading'
                state.error = null
            })
            .addCase(fetchPayments.fulfilled, (state, action) => {
                state.status = 'succeeded'
                paymentAdapter.setAll(state, action.payload)
            })
            .addCase(fetchPayments.rejected, (state, action) => {
                state.status = 'failed'
                if (isRejectedWithValue(action))
                    state.error = typeof action.payload === 'string' ? action.payload : 'Ошибка при получении данных'
                else state.error = 'Неизвестная ошибка';
            })
            .addCase(createPayment.fulfilled, (state, action) => {
                state.status = 'succeeded'
                console.log('createPayment');

                paymentAdapter.addOne(state, action.payload)
            })
            .addCase(updatePayment.fulfilled, (state, action) => {
                state.status = 'succeeded'
                paymentAdapter.updateOne(state, { id: action.payload._id!, changes: action.payload })
            })
            .addCase(deletePayment.fulfilled, (state, action) => {
                paymentAdapter.removeOne(state, action.payload)
            })

    }
})

export const {
    selectAll: selectAllPayments,
    selectById: selectPaymentById,
} = paymentAdapter.getSelectors((state: RootState) => state.payment)

// const cachedResuts = new Map()

// export const selectPaymentsByOrderId = (state: RootState, orderId: string) => {
//     const result = selectAllPayments(state).filter(payment => payment.orderId === orderId)
//     cachedResuts.set(orderId, result)
//     return cachedResuts.get(orderId)
// };

export default paymentSlice.reducer