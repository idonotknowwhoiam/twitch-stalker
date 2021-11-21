import axiod from 'https://deno.land/x/axiod/mod.ts'
import 'https://deno.land/x/dotenv/load.ts'

const instance = axiod.create({
    baseURL: 'https://api.twitch.tv/helix',
    timeout: 2000,
    headers: {
        Authorization: `Bearer ${Deno.env.get('APP_KEY')}`,
        'Client-Id': `${Deno.env.get('CLIENT_KEY')}`,
    },
})

async function getId(login) {
    try {
        const response = await instance.get(`/users?login=${login}`)
        return response.data.data[0].id
    } catch (error) {
        console.error(error)
    }
}

async function getFollows(id, cursor) {
    try {
        const response = await instance.get(
            `/users/follows?from_id=${id}${cursor ? `&after=${cursor}` : ''}`
        )
        for (const channel of response.data.data) {
            channels.push(channel.to_name.toLowerCase())
        }
        if (response.data.pagination.cursor) {
            await getFollows(id, response.data.pagination.cursor)
        }
    } catch (error) {
        console.error(error)
    }
}

async function getChatters(channel) {
    try {
        const response = await axiod.get(`https://tmi.twitch.tv/group/user/${channel}/chatters`)
        if (response.data) {
            return response.data.chatters.viewers
        }
    } catch (error) {
        console.error(error)
    }
}

let channels = []

async function main(user) {
    console.log(`You begin to stalk ${user}`)
    const results = []
    await getFollows(await getId(user))
    for (const channel of channels) {
        console.log(`Searching ${channel}`)
        try {
            const chatters = await getChatters(channel)
            for (const chatter of chatters) {
                if (chatter.toLowerCase() === user) {
                    results.push(channel)
                    break
                }
            }
        } catch (error) {
            console.error(error)
        }
    }

    if (results.length) {
        console.log(`Found at ${results.join(', ')}`)
    } else {
        console.log('Nothing found')
    }
}

main(Deno.args[0])
