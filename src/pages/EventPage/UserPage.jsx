// UserPage.jsx

import React, {useState} from 'react';
import {Modal, Table, Tag, Button} from 'antd';
import {Helmet} from 'react-helmet';
import styles from './UserPage.module.css';

const {Column} = Table;

const userData = [
	{
		id: 1,
		username: 'jdoe',
		fullName: 'John Doe',
		phone: '123-456-7890',
		email: 'jdoe@example.com',
		password: 'password123',
		points: 120,
		status: 'active',
	},
	{
		id: 2,
		username: 'asmith',
		fullName: 'Alice Smith',
		phone: '234-567-8901',
		email: 'asmith@example.com',
		password: 'password456',
		points: 95,
		status: 'inactive',
	},
	{
		id: 3,
		username: 'bwilliams',
		fullName: 'Bob Williams',
		phone: '345-678-9012',
		email: 'bwilliams@example.com',
		password: 'password789',
		points: 150,
		status: 'active',
	},
	{
		id: 4,
		username: 'cjohnson',
		fullName: 'Carol Johnson',
		phone: '456-789-0123',
		email: 'cjohnson@example.com',
		password: 'password321',
		points: 80,
		status: 'inactive',
	},
	{
		id: 5,
		username: 'dwhite',
		fullName: 'David White',
		phone: '567-890-1234',
		email: 'dwhite@example.com',
		password: 'password654',
		points: 200,
		status: 'active',
	},
	{
		id: 6,
		username: 'emiller',
		fullName: 'Eva Miller',
		phone: '678-901-2345',
		email: 'emiller@example.com',
		password: 'password987',
		points: 65,
		status: 'inactive',
	},
	{
		id: 7,
		username: 'fmoore',
		fullName: 'Frank Moore',
		phone: '789-012-3456',
		email: 'fmoore@example.com',
		password: 'password321',
		points: 180,
		status: 'active',
	},
	{
		id: 8,
		username: 'gjones',
		fullName: 'Grace Jones',
		phone: '890-123-4567',
		email: 'gjones@example.com',
		password: 'password654',
		points: 75,
		status: 'inactive',
	},
	{
		id: 9,
		username: 'hbrown',
		fullName: 'Henry Brown',
		phone: '901-234-5678',
		email: 'hbrown@example.com',
		password: 'password987',
		points: 190,
		status: 'active',
	},
	{
		id: 10,
		username: 'ijackson',
		fullName: 'Ivy Jackson',
		phone: '012-345-6789',
		email: 'ijackson@example.com',
		password: 'password123',
		points: 100,
		status: 'inactive',
	},
	{
		id: 11,
		username: 'jmartin',
		fullName: 'Jack Martin',
		phone: '123-456-7890',
		email: 'jmartin@example.com',
		password: 'password456',
		points: 110,
		status: 'active',
	},
	{
		id: 12,
		username: 'klewis',
		fullName: 'Karen Lewis',
		phone: '234-567-8901',
		email: 'klewis@example.com',
		password: 'password789',
		points: 130,
		status: 'inactive',
	},
	{
		id: 13,
		username: 'lclark',
		fullName: 'Leo Clark',
		phone: '345-678-9012',
		email: 'lclark@example.com',
		password: 'password321',
		points: 140,
		status: 'active',
	},
	{
		id: 14,
		username: 'mrobinson',
		fullName: 'Mary Robinson',
		phone: '456-789-0123',
		email: 'mrobinson@example.com',
		password: 'password654',
		points: 160,
		status: 'inactive',
	},
];
export const UserPage = () => {
	const [modalVisible, setModalVisible] = useState(false);
	const [selectedUser, setSelectedUser] = useState(null);
	const [deleteModalVisible, setDeleteModalVisible] = useState(false);
	const [selectedDiamond, setSelectedDiamond] = useState(null);
	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize, setPageSize] = useState(5);

	const handleViewDetails = (record) => {
		setSelectedUser(record);
		setModalVisible(true);
	};

	const handleModalClose = () => {
		setModalVisible(false);
		setSelectedUser(null);
	};

	return (
		<>
			<Helmet>
				<title>User Management</title>
			</Helmet>
			<div className={styles.eventContainer}>
				<div className={styles.eventTitle}>
					<h1>User Management</h1>
				</div>
				<Table
					dataSource={userData}
					rowKey="id"
					pagination={{
						pageSize,
						current: currentPage,
						total: userData.total_page * pageSize,
						onChange: (page, size) => {
							setCurrentPage(page);
							setPageSize(size);
						},
					}}
				>
					<Column title="ID" dataIndex="id" key="id" />
					<Column title="Username" dataIndex="username" key="username" />
					<Column title="Full Name" dataIndex="fullName" key="fullName" />
					<Column title="Phone" dataIndex="phone" key="phone" />
					<Column title="Email" dataIndex="email" key="email" />
					<Column title="Password" dataIndex="password" key="password" />
					<Column title="Points" dataIndex="points" key="points" />
					<Column title="Status" dataIndex="status" key="status" />
					<Column
						title="Action"
						key="action"
						render={(text, record) => (
							<Button type="primary" onClick={() => handleViewDetails(record)}>
								View Details
							</Button>
						)}
					/>
				</Table>
				<Modal
					title="User Details"
					visible={modalVisible}
					onOk={handleModalClose}
					onCancel={handleModalClose}
					footer={null}
				>
					{selectedUser && (
						<div>
							<p>
								<strong>ID:</strong> {selectedUser.id}
							</p>
							<p>
								<strong>Username:</strong> {selectedUser.username}
							</p>
							<p>
								<strong>Full Name:</strong> {selectedUser.fullName}
							</p>
							<p>
								<strong>Phone:</strong> {selectedUser.phone}
							</p>
							<p>
								<strong>Email:</strong> {selectedUser.email}
							</p>
							<p>
								<strong>Password:</strong> {selectedUser.password}
							</p>
							<p>
								<strong>Points:</strong> {selectedUser.points}
							</p>
							<p>
								<strong>Status:</strong> {selectedUser.status}
							</p>
						</div>
					)}
				</Modal>
			</div>
		</>
	);
};
