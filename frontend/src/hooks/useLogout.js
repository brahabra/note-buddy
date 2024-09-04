import { useAuthContext } from './useAuthContext'
import { useNotesContext } from './useNotesContext'

export const useLogout = () => {
  const { dispatch } = useAuthContext()
  const { dispatch: dispatchNotes } = useNotesContext()

  const logout = () => {
    // remove user from storage
    localStorage.removeItem('user')

    // dispatch logout action
    dispatch({ type: 'LOGOUT' })
    dispatchNotes({ type: 'SET_NOTES', payload: null })
  }

  return { logout }
}