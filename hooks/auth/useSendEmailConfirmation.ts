import { useMutation } from 'react-query'
import { httpClient } from 'utils/httpClient'

interface SendEmailConfirmationData {
    email: string
}

function useSendEmailConfirmation() {
    return useMutation(({ email }: SendEmailConfirmationData) => email && httpClient.post("/auth/send-email-confirmation", { email }))
}

export default useSendEmailConfirmation
