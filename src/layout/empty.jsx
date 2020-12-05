import { Empty, Button } from 'antd'
const EmptyNode = ({ addNewTab, openNewFile }) => {
  return (
    <>
      <Empty
        image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
        imageStyle={{
          height: 60,
        }}
        description={
          <span>
            请选择 打开一个文件 或 创建一个文件
          </span>
        }
      >
        <Button onClick={openNewFile}>open File</Button>
        <Button type="primary" style={{ marginLeft: '16px' }} onClick={addNewTab}>create File</Button>
      </Empty>
    </>
  )
}
export default EmptyNode