import React from 'react'
import { useMutation } from 'react-query'
import { httpClient } from 'utils/httpClient'

interface ChangeSelphThumbnailData {
    selphId: number
    thumbnail: File
}

interface ChangeSelphThumbnailProps {
    onSuccess?: (any: any) => any
}

function useChangeSelphThumbnail({ onSuccess }: ChangeSelphThumbnailProps) {
    return useMutation(async ({ selphId, thumbnail }: ChangeSelphThumbnailData) => {
        const formData = new FormData()
        formData.append("files.thumbnail", thumbnail)
        formData.append("data", JSON.stringify({}))
        const { data } = await httpClient.put(`/selphs/${selphId}`, formData)
        return data
    }, { onSuccess })
}

export default useChangeSelphThumbnail
