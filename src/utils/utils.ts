// Replace /ublic from uploaded file url

export const setUploadfileUrl = (obj) => {
    return obj[0].path.replace('public/', '')
} 