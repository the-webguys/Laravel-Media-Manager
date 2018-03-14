import { default as idbKeyVal } from 'idb-keyval'

export default {
    methods: {
        // local storage
        getLs() {
            return this.$ls.get('ctf0-Media_Manager', {})
        },
        updateLs(obj) {
            let storage = this.getLs()

            Object.assign(storage, obj)
            this.$ls.set('ctf0-Media_Manager', storage)
        },
        removeLs() {
            this.folders = []
            this.$ls.remove('ctf0-Media_Manager')
            // location.reload()
        },

        // cache
        cacheResponse(value) {
            return idbKeyVal.set(this.cacheName, value).catch((err) => {
                console.warn('cacheStore.setItem', err)
            })
        },
        getCachedResponse() {
            return idbKeyVal.get(this.cacheName)
        },
        removeCachedResponse(destination = null) {
            let cacheName = this.cacheName
            let extra

            if (destination) {
                extra = destination == '../'
                    // go up
                    ? cacheName.split('/').length > 2 ? cacheName.replace(/\/[^/]+$/, '') : 'root_'
                    // go down
                    : cacheName == 'root_' ? `/${destination}` : `${cacheName}${destination}`
            }

            // avoid clearing twice
            let items = destination
                ? extra == cacheName ? [cacheName] : [extra, cacheName]
                : [cacheName]

            items.forEach((one) => {
                return idbKeyVal.delete(one).then(() => {
                    console.log(`${one} ${this.trans('clear_cache')}`)
                }).catch((err) => {
                    console.warn('cacheStore.removeItem', err)
                })
            })
        },
        clearCache(showNotif = true) {
            idbKeyVal.clear().then(() => {
                if (showNotif) {
                    this.showNotif(this.trans('clear_cache'))
                }

                setTimeout(() => {
                    this.refresh()
                }, 100)
            }).catch((err) => {
                console.error(err)
            })
        }
    }
}
