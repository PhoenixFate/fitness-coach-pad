//设置 set 方法, 原始的localStorage设置方法是 localStorage.setItem("myID",12345); 这里我写在method 的里面
export const setStorage=(key, value, expired)=>{
  let data = { value: value, expire: new Date(new Date().getTime()+expired).getTime() };
  localStorage.setItem(key, JSON.stringify(data));
}

export const getStorage=(key)=>{
  let data = JSON.parse(localStorage.getItem(key));
  if (data !== null) {
    if (data.expire != null && data.expire < new Date().getTime()) {
      localStorage.removeItem(key);
    } else {
      return data.value;
    }
  }
  return null;
}
