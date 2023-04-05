import React, { useState, useEffect } from 'react'
import Urbit from '@urbit/http-api'
import Tome, {
  type KeyValueStore,
  type FeedStore,
  type FeedlogEntry
} from '@holium/tome-db'

const api = new Urbit('', '', window.desk)
api.ship = window.ship

function App() {
  const [kv, setKV] = useState<KeyValueStore | null>(null)
  const [feed, setFeed] = useState<FeedStore | null>(null)
  const [loaded, setLoaded] = useState<boolean>(false)
  const [data, setData] = useState<FeedlogEntry[]>([])

  useEffect(() => {
    async function init() {
      // access our store for current Realm space
      const realmDB = await Tome.init(api, '%APPSLUG%', {
        realm: true,
        permissions: {
          read: 'space',
          write: 'space',
          admin: 'our',
        },
      })
      // personal store, use for app preferences etc.
      const ourDB = await Tome.init(api, '%APPSLUG%', {
        permissions: {
          read: 'our',
          write: 'our',
          admin: 'our',
        },
      })

      const [kv, feed] = await Promise.all([
        ourDB.keyvalue({
          preload: false,
        }),
        realmDB.feed({
          onLoadChange: setLoaded,
          onDataChange: (data: FeedlogEntry[]) => {
            // newest records first.
            // if you want a different order, sort the data here.
            // spread the array to trigger a re-render
            setData([...data])
          },
        })
      ])
      setKV(kv)
      setFeed(feed)
    }
    init()
  }, []);

  return (
    <main className="flex items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold underline">Welcome to %APPNAME%</h1>
    </main>
  )
}

export default App
