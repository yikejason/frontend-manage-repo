interface pathsType {
  dev: string;
  uat: string;
  sit: string;
  prod: string;
}
const paths: pathsType = {
  dev: 'dev',
  uat: 'uat',
  sit: 'sit',
  prod: 'prod',
};
type envType = 'dev' | 'uat' | 'prod' | 'sit';
const env: envType =
  process.env.NODE_ENV === 'production'
    ? 'prod'
    : process.env.NODE_ENV === 'development'
    ? 'dev'
    : process.env.NODE_ENV === 'sit'
    ? 'sit'
    : 'uat';
const pathEnv = paths[env];
export default pathEnv;
