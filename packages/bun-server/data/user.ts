export const USER_DATA = [
  {
    username: 'ONE_PIECE_ZAIZAI',
    pwd: 'nbj123456',
  },
  {
    username: 'root',
    pwd: 'ONE_PIECE_ZAIZAI',
  },
  {
    username: 'youke',
    pwd: '10086',
  },
]

export const getUserinfo = pwd => {
  return USER_DATA.find(item => item.pwd === pwd)
}