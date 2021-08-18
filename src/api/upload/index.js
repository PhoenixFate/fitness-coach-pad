import request from '../../router/axios';
import Compress from 'compress.js';
const compress = new Compress();

const prefix = '/fitness/pad/oss';

export const apiUploadImage = async params => {
  let results = await compress.compress([params.get('file')], {
    size: 2
  });
  const img1 = results[0];
  const base64str = img1.data;
  const imgExt = img1.ext;
  const fileBlob = Compress.convertBase64ToFile(base64str, imgExt);
  const file = new File([fileBlob], img1.alt, { type: imgExt });
  params.set('file', file);
  return await request.post(`${prefix}/`, params, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};
