import React, {useState, useEffect} from 'react';
import {Table, Modal, Button, Input, message, Form} from 'antd';
import axios from 'axios';
import {fetchShells, deleteShell} from '../../redux/slices/shellSlice'; // Assuming you have defined fetchShells and deleteShell actions
import styles from './ShellPage.module.css'; // Import your module.css for styling

const ShellPage = () => {
	const [shellsData, setShellsData] = useState([]);
	const [selectedShell, setSelectedShell] = useState(null);
	const [visible, setVisible] = useState(false);
	const [categoryFilter, setCategoryFilter] = useState('');
	const [isAddingShell, setIsAddingShell] = useState(false); // State for showing add shell modal
	const [newShellData, setNewShellData] = useState({
		shellName: '',
		category: '',
		size: [],
	});

	useEffect(() => {
		fetchShellsFromAPI();
	}, []);

	const fetchShellsFromAPI = () => {
		axios
			.get('http://localhost:8000/api/shells/')
			.then((response) => {
				setShellsData(response.data);
			})
			.catch((error) => {
				console.error('Error fetching shells data:', error);
			});
	};

	const handleCategoryInputChange = (e) => {
		const {value} = e.target;
		setCategoryFilter(value);

		// Perform client-side filtering
		const filteredShells = shellsData.filter((shell) =>
			shell.category.toLowerCase().includes(value.toLowerCase())
		);

		// Set filtered data or reset to original data if filter is empty
		setShellsData(value.trim() === '' ? [...shellsData] : [...filteredShells]);
	};

	const resetFilter = () => {
		setCategoryFilter('');
		fetchShellsFromAPI(); // Reset to fetch all shells
	};

	const columns = [
		{
			title: 'Shell Name',
			dataIndex: 'shellName',
			key: 'shellName',
		},
		{
			title: 'Category',
			dataIndex: 'category',
			key: 'category',
		},
		{
			title: 'Sizes',
			dataIndex: 'size',
			key: 'size',
			render: (sizes) => sizes.join(', '), // Assuming size is an array
		},
		{
			title: 'Action',
			key: 'action',
			render: (text, record) => (
				<Button type="link" onClick={() => showDetailModal(record)}>
					View Details
				</Button>
			),
		},
	];

	const showDetailModal = (record) => {
		setSelectedShell(record);
		setVisible(true);
	};

	const handleDelete = () => {
		if (!selectedShell) return;

		axios
			.delete(`http://localhost:8000/api/shells/delete/${selectedShell._id}`)
			.then((response) => {
				message.success('Shell deleted successfully');
				fetchShellsFromAPI(); // Refresh shellsData after deletion
				setVisible(false);
			})
			.catch((error) => {
				message.error('Failed to delete shell');
				console.error('Error deleting shell:', error);
			});
	};

	const handleCancel = () => {
		setVisible(false);
	};

	const handleAddShell = () => {
		setIsAddingShell(true);
	};

	const handleAddShellCancel = () => {
		setIsAddingShell(false);
		setNewShellData({
			shellName: '',
			category: '',
			size: [],
		});
	};

	const handleAddShellSubmit = () => {
		// Assuming you have an API endpoint for adding a new shell
		axios
			.post('http://localhost:8000/api/shells/add', newShellData)
			.then((response) => {
				message.success('Shell added successfully');
				fetchShellsFromAPI(); // Refresh shellsData after adding
				setIsAddingShell(false);
				setNewShellData({
					shellName: '',
					category: '',
					size: [],
				});
			})
			.catch((error) => {
				message.error('Failed to add shell');
				console.error('Error adding shell:', error);
			});
	};

	const handleNewShellInputChange = (e) => {
		const {name, value} = e.target;
		setNewShellData({
			...newShellData,
			[name]: value,
		});
	};

	return (
		<div className={styles.container}>
			<h1 className={styles.title}>Shells Page</h1>
			<div style={{display: 'flex', justifyContent: 'space-between'}}>
				<div className={styles.filterRow}>
					{/* Category Filter Input */}
					<Input
						placeholder="Enter category to filter shells"
						value={categoryFilter}
						onChange={handleCategoryInputChange}
						className={styles.input}
					/>
					<Button onClick={resetFilter} className={styles.clearButton}>
						Clear
					</Button>

					{/* Add Shell Button */}
				</div>
				<Button type="primary" onClick={handleAddShell} className={styles.addButton}>
					Add Shell
				</Button>
			</div>
			<Table
				dataSource={shellsData}
				columns={columns}
				rowKey="_id"
				className={styles.table}
			/>

			{/* Modal for Adding Shell */}
			<Modal
				title="Add New Shell"
				visible={isAddingShell}
				onOk={handleAddShellSubmit}
				onCancel={handleAddShellCancel}
				okText="Add"
				cancelText="Cancel"
			>
				<Form layout="vertical">
					<Form.Item label="Shell Name">
						<Input
							name="shellName"
							value={newShellData.shellName}
							onChange={handleNewShellInputChange}
						/>
					</Form.Item>
					<Form.Item label="Category">
						<Input
							name="category"
							value={newShellData.category}
							onChange={handleNewShellInputChange}
						/>
					</Form.Item>
					<Form.Item label="Sizes">
						<Input
							name="size"
							value={newShellData.size}
							onChange={handleNewShellInputChange}
						/>
					</Form.Item>
				</Form>
			</Modal>

			{/* Modal for Viewing Shell Details */}
			<Modal
				title="Shell Details"
				visible={visible}
				onOk={handleDelete}
				onCancel={handleCancel}
				footer={[
					<Button key="cancel" onClick={handleCancel}>
						Cancel
					</Button>,
					<Button key="delete" type="primary" danger onClick={handleDelete}>
						Delete
					</Button>,
				]}
			>
				{selectedShell && (
					<div className={styles.detailContainer}>
						<div className={styles.detailLeft}>
							<p>
								<strong>Shell Name:</strong> {selectedShell.shellName}
							</p>
							<p>
								<strong>Category:</strong> {selectedShell.category}
							</p>
							<p>
								<strong>Sizes:</strong> {selectedShell.size.join(', ')}
							</p>
						</div>
						<div className={styles.detailRight}>
							<p>
								<strong>Created At:</strong> {selectedShell.createdAt}
							</p>
							<p>
								<strong>Updated At:</strong> {selectedShell.updatedAt}
							</p>
						</div>
					</div>
				)}
			</Modal>
		</div>
	);
};

export default ShellPage;
