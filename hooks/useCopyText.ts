import { useState } from 'react'

function useCopyText() {
    const [copied, setCopied] = useState<boolean>(false)

    const copyText = async (text: string) => {
        return navigator.clipboard.writeText(text).then(() => setCopied(true))
    }

    return { copyText, copied, setCopied }
}

export default useCopyText
