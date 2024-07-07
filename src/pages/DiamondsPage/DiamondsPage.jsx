import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Button, DatePicker, Form, Input, Modal, Select, Table, Tag, Tooltip} from 'antd';
import dayjs from 'dayjs';
import {fetchUsers, createUser, updateUser, deleteUser} from '../../redux/slices/userSlice';
import {getAllUserSelector, getLoadingUserSelector} from '../../redux/selectors';
import {Helmet} from 'react-helmet';
import {DeleteFilled, EditFilled} from '@ant-design/icons';
import styles from './DiamondPage.module.css';

const {Column} = Table;
const {Item} = Form;
const {Option} = Select;

const DiamondType = {
	round: 'Round',
	princess: 'Princess',
	emerald: 'Emerald',
	asscher: 'Asscher',
	cushion: 'Cushion',
	marquise: 'Marquise',
	radiant: 'Radiant',
	oval: 'Oval',
	pear: 'Pear',
	heart: 'Heart',
};

const fixedData = {
	list_diamonds: [
		{
			id: 1,
			name: 'Round Brilliant',
			carat: 1.0,
			color: 'D',
			clarity: 'VVS1',
			cut: 'Excellent',
			date_added: '2022-01-01',
			type: 'round',
			status: 'available',
		},
		{
			id: 2,
			name: 'Princess Cut',
			carat: 0.9,
			color: 'E',
			clarity: 'VS1',
			cut: 'Very Good',
			date_added: '2022-02-15',
			type: 'princess',
			status: 'sold',
		},
		{
			id: 3,
			name: 'Emerald Cut',
			carat: 1.5,
			color: 'F',
			clarity: 'SI1',
			cut: 'Good',
			date_added: '2022-03-01',
			type: 'emerald',
			status: 'available',
		},
		{
			id: 4,
			name: 'Asscher Cut',
			carat: 1.2,
			color: 'G',
			clarity: 'VS2',
			cut: 'Very Good',
			date_added: '2022-04-12',
			type: 'asscher',
			status: 'sold',
		},
		{
			id: 5,
			name: 'Cushion Cut',
			carat: 1.3,
			color: 'H',
			clarity: 'VVS2',
			cut: 'Excellent',
			date_added: '2022-05-23',
			type: 'cushion',
			status: 'available',
		},
		{
			id: 6,
			name: 'Marquise Cut',
			carat: 0.8,
			color: 'I',
			clarity: 'VS1',
			cut: 'Good',
			date_added: '2022-06-04',
			type: 'marquise',
			status: 'sold',
		},
		{
			id: 7,
			name: 'Radiant Cut',
			carat: 1.1,
			color: 'J',
			clarity: 'SI2',
			cut: 'Very Good',
			date_added: '2022-07-19',
			type: 'radiant',
			status: 'available',
		},
		{
			id: 8,
			name: 'Oval Cut',
			carat: 1.4,
			color: 'K',
			clarity: 'IF',
			cut: 'Excellent',
			date_added: '2022-08-25',
			type: 'oval',
			status: 'sold',
		},
		{
			id: 9,
			name: 'Pear Cut',
			carat: 1.7,
			color: 'D',
			clarity: 'VVS1',
			cut: 'Good',
			date_added: '2022-09-10',
			type: 'pear',
			status: 'available',
		},
		{
			id: 10,
			name: 'Heart Cut',
			carat: 0.95,
			color: 'E',
			clarity: 'VS2',
			cut: 'Very Good',
			date_added: '2022-10-30',
			type: 'heart',
			status: 'sold',
		},
		{
			id: 11,
			name: 'Round Brilliant',
			carat: 1.0,
			color: 'F',
			clarity: 'VVS2',
			cut: 'Excellent',
			date_added: '2022-11-15',
			type: 'round',
			status: 'available',
		},
		{
			id: 12,
			name: 'Princess Cut',
			carat: 1.2,
			color: 'G',
			clarity: 'VS1',
			cut: 'Very Good',
			date_added: '2022-12-05',
			type: 'princess',
			status: 'sold',
		},
		{
			id: 13,
			name: 'Emerald Cut',
			carat: 1.6,
			color: 'H',
			clarity: 'SI1',
			cut: 'Good',
			date_added: '2023-01-01',
			type: 'emerald',
			status: 'available',
		},
		{
			id: 14,
			name: 'Asscher Cut',
			carat: 1.3,
			color: 'I',
			clarity: 'VS2',
			cut: 'Very Good',
			date_added: '2023-02-14',
			type: 'asscher',
			status: 'sold',
		},
	],
};

export const DiamondsPage = () => {
	const [form] = Form.useForm();
	const [modalVisible, setModalVisible] = useState(false);
	const [deleteModalVisible, setDeleteModalVisible] = useState(false);
	const [selectedDiamond, setSelectedDiamond] = useState(null);
	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize, setPageSize] = useState(5);

	const allDiamonds = useSelector(getAllUserSelector); // Should be replaced by fixed data
	const loading = useSelector(getLoadingUserSelector);
	const dispatch = useDispatch();

	useEffect(() => {
		// Dispatch fetching action here
	}, [dispatch, currentPage, pageSize]);

	useEffect(() => {
		if (allDiamonds) {
			form.setFieldsValue(allDiamonds);
		}
	}, [allDiamonds, form]);

	const handleCreateDiamond = () => {
		setModalVisible(true);
		form.resetFields();
	};

	const handleEdit = (record) => {
		form.setFieldsValue({
			name: record.name,
			carat: record.carat,
			color: record.color,
			clarity: record.clarity,
			cut: record.cut,
			type: record.type,
			date_added: record.date_added ? dayjs(record.date_added) : null,
			status: record.status,
		});
		setSelectedDiamond(record);
		setModalVisible(true);
	};

	const handleDelete = (record) => {
		setSelectedDiamond(record);
		setDeleteModalVisible(true);
	};

	const handleDeleteConfirm = () => {
		// Dispatch delete action here
		setDeleteModalVisible(false);
	};

	const handleModalSuccess = () => {
		form.validateFields()
			.then((values) => {
				if (values.date_added) {
					values.date_added = dayjs(values.date_added).toISOString();
				}
				if (selectedDiamond) {
					// Dispatch update action here
				} else {
					values.status = 'available'; // Default status for new diamonds
					// Dispatch create action here
				}
				setModalVisible(false);
				form.resetFields();
			})
			.catch((error) => {
				console.error('Form validation error:', error);
			});
	};

	const handleModalCancel = () => {
		setModalVisible(false);
		form.resetFields();
	};

	const handleDeleteCancel = () => {
		setDeleteModalVisible(false);
	};

	return (
		<>
			<Helmet>
				<title>Manage Diamonds</title>
			</Helmet>
			<div className={styles.userContainer}>
				<div className={styles.userTitle}>
					<h1>Manage Diamonds</h1>
				</div>

				<div className={styles.createBtn}>
					<Button type="primary" onClick={handleCreateDiamond}>
						Add Diamond
					</Button>
				</div>

				<Table
					dataSource={fixedData.list_diamonds}
					rowKey="id"
					pagination={{
						pageSize,
						current: currentPage,
						total: fixedData.total_page * pageSize,
						onChange: (page, size) => {
							setCurrentPage(page);
							setPageSize(size);
						},
					}}
					loading={loading}
				>
					<Column title="Name" dataIndex="name" key="name" />
					<Column title="Carat" dataIndex="carat" key="carat" />
					<Column title="Color" dataIndex="color" key="color" />
					<Column title="Clarity" dataIndex="clarity" key="clarity" />
					<Column title="Cut" dataIndex="cut" key="cut" />
					<Column
						title="Date Added"
						dataIndex="date_added"
						key="date_added"
						render={(date_added) =>
							date_added ? dayjs(date_added).format('DD-MM-YYYY') : ''
						}
					/>
					<Column title="Type" dataIndex="type" key="type" />
					<Column title="Status" dataIndex="status" key="status" />

					<Column
						title="Action"
						key="action"
						render={(text, record) => (
							<span>
								<Button
									type="primary"
									onClick={() => handleEdit(record)}
									style={{marginRight: 10}}
								>
									<Tooltip title="Edit">
										<EditFilled />
									</Tooltip>
								</Button>
								<Button
									type="danger"
									onClick={() => handleDelete(record)}
									style={{backgroundColor: '#ff0000', color: 'white'}}
								>
									<Tooltip title="Delete">
										<DeleteFilled />
									</Tooltip>
								</Button>
							</span>
						)}
					/>
				</Table>

				<Modal
					title={selectedDiamond ? 'Edit Diamond' : 'Create Diamond'}
					visible={modalVisible}
					onOk={handleModalSuccess}
					onCancel={handleModalCancel}
					bodyStyle={{
						// background:
						// 	'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url("https://e0.pxfuel.com/wallpapers/210/363/desktop-wallpaper-black-diamonds-background-black-diamonds-background-for-your-mobile-tablet-explore-black-diamond-black-black-and-white-diamond-diamonds.jpg")',
						// backgroundSize: 'cover',
						// backgroundPosition: 'center',
						border: '2px solid white',
					}}
				>
					<Form form={form} layout="vertical" className={styles.formContainer}>
						<Item label="Name" name="name">
							<Input />
						</Item>
						<Item label="Clarity" name="clarity">
							<Input />
						</Item>
						<Item label="Cut" name="cut">
							<Input />
						</Item>
						<Item label="Type" name="type">
							<Select>
								{Object.keys(DiamondType).map((type) => (
									<Option key={type} value={type}>
										{DiamondType[type]}
									</Option>
								))}
							</Select>
						</Item>
						<Item label="Date Added" name="date_added">
							<DatePicker format="DD-MM-YYYY" />
						</Item>
						<Item label="Status" name="status">
							<Select>
								<Option value="available">Available</Option>
								<Option value="sold">Sold</Option>
							</Select>
						</Item>
					</Form>
				</Modal>

				<Modal
					title="Confirm Delete"
					visible={deleteModalVisible}
					onOk={handleDeleteConfirm}
					onCancel={handleDeleteCancel}
				>
					<p>Are you sure you want to delete this diamond?</p>
				</Modal>
			</div>
		</>
	);
};
