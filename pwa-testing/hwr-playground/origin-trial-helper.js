function parseExpiryTimeOriginTrialToken() {
  try {
    const metaTag = document.querySelector('meta[http-equiv="origin-trial"]')
    const token = metaTag.getAttribute('content')
    
    const str = atob(token)
    const expiryUnixTimestamp = parseInt(/"expiry":\s*(\d+)/.exec(str)[1], 10)
    
    return expiryUnixTimestamp * 1000
  } catch(e) {
    console.error(r)
    return 0
  }
}