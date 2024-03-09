"use client"
import React, {useState} from 'react';
import {
    Button,
    Card,
    Input,
    message,
    Spin,
    Checkbox,
    InputNumber,
    Progress,
    Typography,
    Row,
    Col,
    Table,
    Modal,
    Tag
} from 'antd';
import {ethers} from 'ethers';
import send_mail from '@/service/3/dmail'
import gamic_swap from "@/service/3/gamic";
import asmatch from "@/service/3/asmatch";
import bitavatar from "@/service/3/bitavatar";
import readon from "@/service/3/readon";
import sendmoneygun from "@/service/3/sendmoneygun";

const {Title} = Typography;

const tasks = [
    {name: '发送邮件', task: send_mail},
    {name: 'Gamic 交换', task: gamic_swap},
    {name: 'Asmatch', task: asmatch},
    {name: 'Bitavatar', task: bitavatar},
    {name: 'Readon', task: readon},
    {name: '发送 Money Gun', task: sendmoneygun}
];

const App = () => {
    const [loading, setLoading] = useState(false);
    const [keys, setKeys] = useState('');
    const [selectedTasks, setSelectedTasks] = useState([]);
    const [taskIntervalMin, setTaskIntervalMin] = useState(30);
    const [taskIntervalMax, setTaskIntervalMax] = useState(60);
    const [accountIntervalMin, setAccountIntervalMin] = useState(30);
    const [accountIntervalMax, setAccountIntervalMax] = useState(60);
    const [tableData, setTableData] = useState([]);
    const [waitingMessage, setWaitingMessage] = useState('');
    const [modalVisible, setModalVisible] = useState(false);

    const startTasks = async () => {
        setLoading(true);
        const keyArray = keys.split('\n').map(key => key.trim()).filter(key => key !== '');
        const data = await Promise.all(keyArray.map(async (key) => {
            const wallet = new ethers.Wallet(key);
            const address = await wallet.getAddress();
            return {
                key,
                address,
                tasks: selectedTasks.map(task => ({name: task.name, status: 'waiting', hash: ''})),
            };
        }));
        setTableData(data);
        setModalVisible(false);

        for (let i = 0; i < keyArray.length; i++) {
            const key = keyArray[i];
            for (let j = 0; j < selectedTasks.length; j++) {
                const task = selectedTasks[j];
                const result = await task.task(key);
                const newData = [...data];
                const taskIndex = newData[i].tasks.findIndex(t => t.name === task.name);
                if (result) {
                    newData[i].tasks[taskIndex].status = 'success';
                    newData[i].tasks[taskIndex].hash = result;
                } else {
                    newData[i].tasks[taskIndex].status = 'error';
                }
                setTableData(newData);

                if (j < selectedTasks.length - 1) {
                    const waitTime = Math.floor(Math.random() * (taskIntervalMax - taskIntervalMin + 1)) + taskIntervalMin;
                    setWaitingMessage(`等待 ${waitTime} 秒后执行下一个任务...`);
                    await new Promise(resolve => setTimeout(resolve, waitTime * 1000));
                }
            }

            if (i < keyArray.length - 1) {
                const waitTime = Math.floor(Math.random() * (accountIntervalMax - accountIntervalMin + 1)) + accountIntervalMin;
                setWaitingMessage(`等待 ${waitTime} 秒后执行下一个账号...`);
                await new Promise(resolve => setTimeout(resolve, waitTime * 1000));
            }
        }

        setLoading(false);
        setWaitingMessage('');
        message.success('所有任务执行完毕！');
    };

    const handleTaskChange = (checkedValues) => {
        const selectedTasks = tasks.filter(task => checkedValues.includes(task.name));
        setSelectedTasks(selectedTasks);
    };

    const columns = [
        {
            title: '地址',
            dataIndex: 'address',
            key: 'address',
        },
        ...selectedTasks.map(task => ({
            title: task.name,
            key: task.name,
            render: (text, record) => {
                const taskRecord = record.tasks.find(t => t.name === task.name);
                return (
                    <div>
                        {taskRecord.status === 'waiting' && (
                            <Tag color="default">等待中</Tag>
                        )}
                        {taskRecord.status === 'success' && (
                            <Tag color="success">
                                成功
                                {taskRecord.hash && (
                                    <a
                                        href={`https://lineascan.build/tx/${taskRecord.hash}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{marginLeft: 8}}
                                    >
                                        查看交易
                                    </a>
                                )}
                            </Tag>
                        )}
                        {taskRecord.status === 'error' && (
                            <Tag color="error">失败</Tag>
                        )}
                    </div>
                );
            },
        })),
    ];

    return (
        <div style={{padding: '24px'}}>
            <Card>
                <Title level={2} style={{textAlign: 'center', marginBottom: '24px'}}>Linea Park 第三周（任务1-6）</Title>
                <Row gutter={[16, 16]}>
                    <Col xs={24} sm={12}>
                        <Button type="primary" onClick={() => setModalVisible(true)} block>
                            输入私钥
                        </Button>
                    </Col>
                    <Col xs={24} sm={12}>
                        <Checkbox.Group options={tasks.map(task => task.name)} onChange={handleTaskChange}
                                        style={{marginBottom: 16}}/>
                        <Row gutter={16}>
                            <Col xs={12}>
                                <div style={{marginBottom: 16}}>
                                    <span>任务间隔时间（秒）：</span>
                                    <InputNumber min={1} value={taskIntervalMin} onChange={setTaskIntervalMin}/>
                                    <span> - </span>
                                    <InputNumber min={1} value={taskIntervalMax} onChange={setTaskIntervalMax}/>
                                </div>
                            </Col>
                            <Col xs={12}>
                                <div style={{marginBottom: 16}}>
                                    <span>账号间隔时间（秒）：</span>
                                    <InputNumber min={1} value={accountIntervalMin} onChange={setAccountIntervalMin}/>
                                    <span> - </span>
                                    <InputNumber min={1} value={accountIntervalMax} onChange={setAccountIntervalMax}/>
                                </div>
                            </Col>
                        </Row>
                        <Button type="primary" onClick={startTasks} disabled={loading || !keys} block>
                            {loading ? <Spin/> : '开始执行任务'}
                        </Button>
                    </Col>
                </Row>
                <Row style={{marginTop: '24px'}}>
                    <Col xs={24}>
                        {waitingMessage && <div style={{marginBottom: '16px'}}>{waitingMessage}</div>}
                        <Table columns={columns} dataSource={tableData} pagination={false}/>
                    </Col>
                </Row>
            </Card>
            <Modal
                title="输入私钥"
                open={modalVisible}
                onOk={() => setModalVisible(false)}
                onCancel={() => setModalVisible(false)}
                width={800}
            >
                <Input.TextArea
                    placeholder="请输入私钥（每行一个）"
                    value={keys}
                    onChange={e => setKeys(e.target.value)}
                    rows={20}
                />
            </Modal>
        </div>
    );
};

export default App;