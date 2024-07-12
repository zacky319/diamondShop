import React, { useState } from 'react';
import { Button, Form, Input, Modal, Table, Tooltip } from 'antd';
import { EditFilled, DeleteFilled, InfoCircleFilled } from '@ant-design/icons';
import styles from './UserPage.module.css'; // Ensure you create and import this CSS file

const { Column } = Table;
const { Item } = Form;

const UserPage = () => {
  const [form] = Form.useForm();
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([
    {
      id: 1,
      username: 'john_doe',
      fullName: 'John Doe',
      phone: '123-456-7890',
      email: 'john.doe@example.com',
      status: 'Active'
    },
    {
      id: 2,
      username: 'jane_smith',
      fullName: 'Jane Smith',
      phone: '987-654-3210',
      email: 'jane.smith@example.com',
      status: 'Inactive'
    }
    // Add more fake user data as needed
  ]);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const handleCreateUser = () => {
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record) => {
    setSelectedUser(record);
    setModalVisible(true);
  };

  const handleDelete = (record) => {
    setSelectedUser(record);
    setDeleteModalVisible(true);
  };

  const handleViewDetails = (record) => {
    setSelectedUser(record);
    setDetailModalVisible(true);
  };

  const handleDeleteConfirm = () => {
    const updatedUsers = users.filter(user => user.id !== selectedUser.id);
    setUsers(updatedUsers);
    setDeleteModalVisible(false);
  };

  const handleModalSuccess = () => {
    form.validateFields()
      .then(values => {
        if (selectedUser) {
          const updatedUsers = users.map(user =>
            user.id === selectedUser.id ? { ...user, ...values } : user
          );
          setUsers(updatedUsers);
        } else {
          const newUser = {
            id: users.length + 1,
            ...values
          };
          setUsers([...users, newUser]);
        }
        setModalVisible(false);
        form.resetFields();
      })
      .catch(error => {
        console.error('Form validation error:', error);
      });
  };

  const handleModalCancel = () => {
    setModalVisible(false);
    form.resetFields();
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Manage Users</h1>
        <Button type="primary" onClick={handleCreateUser}>
          Add User
        </Button>
      </div>

      <Table
        dataSource={users}
        rowKey="id"
        pagination={{
          pageSize,
          current: currentPage,
          total: users.length,
          onChange: (page, size) => {
            setCurrentPage(page);
            setPageSize(size);
          },
        }}
        className={styles.table}
      >
        <Column title="ID" dataIndex="id" key="id" />
        <Column title="Username" dataIndex="username" key="username" />
        <Column title="Full Name" dataIndex="fullName" key="fullName" />
        <Column title="Phone" dataIndex="phone" key="phone" />
        <Column title="Email" dataIndex="email" key="email" />
        <Column title="Status" dataIndex="status" key="status" />
        <Column
          title="Action"
          key="action"
          className={styles.actionColumn}
          render={(text, record) => (
            <span>
              <Tooltip title="Edit">
                <Button type="primary" icon={<EditFilled />} onClick={() => handleEdit(record)} />
              </Tooltip>
              <Tooltip title="Delete">
                <Button type="danger" icon={<DeleteFilled />} onClick={() => handleDelete(record)} />
              </Tooltip>
              <Tooltip title="View Details">
                <Button icon={<InfoCircleFilled />} onClick={() => handleViewDetails(record)} />
              </Tooltip>
            </span>
          )}
        />
      </Table>

      <Modal
        title={selectedUser ? 'Edit User' : 'Add User'}
        visible={modalVisible}
        onOk={handleModalSuccess}
        onCancel={handleModalCancel}
      >
        <Form form={form} layout="vertical">
          <Item label="Username" name="username" rules={[{ required: true, message: 'Please enter username' }]}>
            <Input />
          </Item>
          <Item label="Full Name" name="fullName" rules={[{ required: true, message: 'Please enter full name' }]}>
            <Input />
          </Item>
          <Item label="Phone" name="phone" rules={[{ required: true, message: 'Please enter phone number' }]}>
            <Input />
          </Item>
          <Item label="Email" name="email" rules={[{ required: true, message: 'Please enter email' }]}>
            <Input />
          </Item>
          <Item label="Status" name="status" rules={[{ required: true, message: 'Please enter status' }]}>
            <Input />
          </Item>
        </Form>
      </Modal>

      <Modal
        title="Confirm Delete"
        visible={deleteModalVisible}
        onOk={handleDeleteConfirm}
        onCancel={() => setDeleteModalVisible(false)}
      >
        <p>Are you sure you want to delete this user?</p>
      </Modal>

      <Modal
        title="User Details"
        visible={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailModalVisible(false)}>
            Close
          </Button>
        ]}
      >
        {selectedUser && (
          <div className={styles.detailContainer}>
            <p><strong>Username:</strong> {selectedUser.username}</p>
            <p><strong>Full Name:</strong> {selectedUser.fullName}</p>
            <p><strong>Phone:</strong> {selectedUser.phone}</p>
            <p><strong>Email:</strong> {selectedUser.email}</p>
            <p><strong>Status:</strong> {selectedUser.status}</p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default UserPage;
