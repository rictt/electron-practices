;(function () {
  function rewriteRequest() {
    console.log('rewrite')
    const originOpen = XMLHttpRequest.prototype.open
    const intercepts = []
    XMLHttpRequest.prototype.open = function (_, url) {
      try {
        this.addEventListener('readystatechange', function () {
          if (this.readyState === 4) {
            const callbacks = intercepts.filter((e) => e.condition(this, url))
            callbacks.forEach((e) => e.callback(this.response, url))
          }
        })
        originOpen.apply(this, arguments)
      } catch (error) {
        console.log(error)
      }
    }

    function registerResponseIntercept(condition, callback) {
      intercepts.push({
        condition,
        callback
      })
    }

    return {
      registerResponseIntercept
    }
  }
  const { registerResponseIntercept } = rewriteRequest()

  registerResponseIntercept((xhr, url) => {
    const contentType = (
      xhr.getResponseHeader('Content-Type') || xhr.getResponseHeader('Content-Type')
    ).toLowerCase()
    const m3u8Marker = ['x-mpegURL', 'vnd.apple.mpegur']
    if (m3u8Marker.includes(contentType) || url.indexOf('.m3u8') !== -1) {
      return true
    }
    return false
  }, onM3u8Response)

  registerResponseIntercept((xhr, url) => url.indexOf('getKeyForHls') !== -1, onM3u8KeyResponse)
})()

function onM3u8Response(response, m3u8Url) {
  try {
    console.log('on m3u8 response：')
  } catch (error) {
    console.log(error)
  }
}

function onM3u8KeyResponse() {
  console.log('m3 u8')
}
