import { useCallback, useEffect, useState } from "react"
import { useDropzone } from "react-dropzone"

// use file upload
// will support multiple file uploads or single file upload
// will be able to act on the file
// or get a list of files
interface UseFileUploadProps {
    multiple?: boolean
    accept?: string | string[]
    noClick?: boolean
    noKeyboard?: boolean
    onFilesDropped?: (files: File[]) => any
}

function useFileUpload({ onFilesDropped, accept, multiple = false, noClick = false, noKeyboard = false }: UseFileUploadProps) {
    const [acceptedFiles, setAcceptedFiles] = useState<(File & { preview: string })[]>([])

    const onDrop = useCallback(
        (files: File[]) => {
            if (onFilesDropped) onFilesDropped(files)
        },
        [onFilesDropped]
    )

    const {
        getRootProps,
        getInputProps,
        isDragActive,
        open,
        acceptedFiles: acceptedDropzoneFiles,
    } = useDropzone({ onDrop, multiple, accept, noClick, noKeyboard })

    useEffect(() => {
        // allow for previewing of accepted files
        const files = acceptedDropzoneFiles.map((file) =>
            Object.assign(file, {
                preview: URL.createObjectURL(file),
            })
        )
        setAcceptedFiles([...files])
    }, [acceptedDropzoneFiles])

    const removeFile = (file) => {
        if (file?.path)
            setAcceptedFiles((prevAcceptedFiles) => prevAcceptedFiles.filter((f) => f['path'] !== file.path))
    }

    return {
        isDragActive,
        acceptedFiles,
        getRootProps,
        getInputProps,
        removeFile,
        open
    }
}

export default useFileUpload
