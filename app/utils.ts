import client from "@/sanity/client";

async function updateData() {
    const doc = {
        _type: 'category',
        name: 'Sanity Tandem Extraordinaire'
    }

    client.create(doc).then((res) => {
        console.log(`Bike was created, document ID is ${res._id}`)
    })
}
updateData();