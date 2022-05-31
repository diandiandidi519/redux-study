function fooMiddleware({ getState, dispatch }) {
  return function map_from_foo(next) {
    console.log("[fooMiddleware] trigger");
    return function next_from_foo(action) {
      console.log("[fooMiddleware] before next");
      next(action);
      console.log("[fooMiddleware] after next");
    };
  }
}

function barMiddleware({ getState, dispatch }) {
  return function map_from_bar(next) {
    console.log("[barMiddleware] trigger");
    return function next_from_bar(action) {
      console.log("[barMiddleware] before next");
      next(action);
      console.log("[barMiddleware] after next");
    };
  }
}

function bazMiddleware({ getState, dispatch }) {
  return function map_from_baz(next) {
    console.log("[bazMiddleware] trigger");
    return function next_from_baz(action) {
      console.log("[bazMiddleware] before next");
      next(action);
      console.log("[bazMiddleware] after next");
    };
  }
}


function thunkMiddleware({ getState, dispatch }) {
  return function map_from_thunk(next) {
    return function next_from_thunk(action) {
      if (typeof action === 'function') {
        // Inject the store's `dispatch` and `getState` methods, as well as any "extra arg"
        return action(dispatch, getState)
      }

      // Otherwise, pass the action down the middleware chain as usual
      return next(action)
    }
  }
}

function counter(state, action) {
  if (typeof state === 'undefined') {
    return 0
  }

  switch (action.type) {
    case 'INCREMENT':
      return state + 1
    case 'DECREMENT':
      return state - 1
    default:
      return state
  }
}

const store = Redux.createStore(counter, Redux.applyMiddleware(fooMiddleware, barMiddleware, bazMiddleware, thunkMiddleware));



const valueEl = document.getElementById('value')

function render() {
  valueEl.innerHTML = store.getState().toString()
}

render()

store.subscribe(render)

document.getElementById('increment')
  .addEventListener('click', function () {
    store.dispatch({ type: 'INCREMENT' })
  })

document.getElementById('decrement')
  .addEventListener('click', function () {
    store.dispatch({ type: 'DECREMENT' })
  })

document.getElementById('incrementIfOdd')
  .addEventListener('click', function () {
    if (store.getState() % 2 !== 0) {
      store.dispatch({ type: 'INCREMENT' })
    }
  })

document.getElementById('incrementAsync')
  .addEventListener('click', function () {
    // setTimeout(function () {
    //   store.dispatch({ type: 'INCREMENT' })
    // }, 1000)
    store.dispatch(asyncFetch)
  })

const sleep = (timeout) => new Promise((resolve, reject) => {
  setTimeout(function () {
    resolve()
  }, timeout)
})

const asyncFetch = (dispatch, getState) => {
  sleep(1000).then(() => {
    dispatch({ type: 'INCREMENT' })
  })
}
