const imageRouter = async (req, res) => {
    if (req.url.match("/api/photos/all") && req.method == "GET") {
        console.log('ez?')
        // console.log(photos)
        // response.end(photos)
    }
}
export default imageRouter