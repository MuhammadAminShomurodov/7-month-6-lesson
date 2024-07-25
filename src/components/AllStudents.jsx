import { useState, useEffect } from "react";
import {
  Layout,
  Menu,
  Table,
  Button,
  Modal,
  Input,
  Select,
  notification,
  Form,
} from "antd";
import axios from "axios";
import { useForm, Controller } from "react-hook-form";
import {
  UserOutlined,
  EditOutlined,
  DeleteOutlined,
  LogoutOutlined,
} from "@ant-design/icons";

const { Header, Content, Sider } = Layout;
const { Option } = Select;

function AllStudents() {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [collapsed, setCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("");

  const { control, handleSubmit, reset, setValue } = useForm();

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    const filtered = students.filter((student) => {
      const matchesSearch = Object.values(student).some((value) =>
        value.toLowerCase().includes(searchQuery.toLowerCase())
      );
      const matchesGroup = selectedGroup
        ? student.group === selectedGroup
        : true;
      return matchesSearch && matchesGroup;
    });
    setFilteredStudents(filtered);
  }, [searchQuery, selectedGroup, students]);

  const fetchStudents = async () => {
    try {
      const response = await axios.get("http://localhost:3000/students");
      setStudents(response.data);
      setFilteredStudents(response.data);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const showModal = (student = null) => {
    setEditingStudent(student);
    setIsModalVisible(true);

    if (student) {
      setValue("firstname", student.firstname);
      setValue("lastname", student.lastname);
      setValue("group", student.group);
    } else {
      reset({
        firstname: "",
        lastname: "",
        group: "",
      });
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingStudent(null);
    reset();
  };

  const onSubmit = async (values) => {
    try {
      if (editingStudent) {
        await axios.put(
          `http://localhost:3000/students/${editingStudent.id}`,
          values
        );
        notification.success({ message: "Student updated successfully!" });
      } else {
        await axios.post("http://localhost:3000/students", values);
        notification.success({ message: "Student added successfully!" });
      }
      fetchStudents();
      handleCancel();
    } catch (error) {
      console.error("Error saving student:", error);
    }
  };

  const editStudent = (student) => {
    showModal(student);
  };

  const deleteStudent = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/students/${id}`);
      notification.success({ message: "Student deleted successfully!" });
      fetchStudents();
    } catch (error) {
      console.error("Error deleting student:", error);
    }
  };

  const confirmDelete = (id) => {
    Modal.confirm({
      title: "Are you sure you want to delete this student?",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: () => deleteStudent(id),
    });
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleGroupChange = (value) => {
    setSelectedGroup(value);
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    window.location.href = "/login";
  };

  const columns = [
    {
      title: "First Name",
      dataIndex: "firstname",
      key: "firstname",
    },
    {
      title: "Last Name",
      dataIndex: "lastname",
      key: "lastname",
    },
    {
      title: "Group",
      dataIndex: "group",
      key: "group",
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <span>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => editStudent(record)}
          >
            Edit
          </Button>
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => confirmDelete(record.id)}
          >
            Delete
          </Button>
        </span>
      ),
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
        <div className="logo">
          {collapsed ? (
            <UserOutlined
              style={{ fontSize: "24px", color: "white", margin: "16px" }}
            />
          ) : (
            <div
              style={{ color: "white", textAlign: "center", padding: "16px" }}
            >
              Student Admin
            </div>
          )}
        </div>
        <Menu theme="dark" defaultSelectedKeys={["1"]} mode="inline">
          <Menu.Item key="1" icon={<UserOutlined />}>
            Students
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Header className="site-layout-background" style={{ padding: 0 }}>
          <Button
            type="default"
            icon={<LogoutOutlined />}
            onClick={handleLogout}
            style={{ margin: "16px" }}
          >
            Logout
          </Button>
        </Header>
        <Content style={{ margin: "16px 16px", padding: 0 }}>
          <div style={{ padding: 0 }}>
            <Input
              placeholder="Search..."
              value={searchQuery}
              onChange={handleSearchChange}
              style={{ marginBottom: 16, width: 300, marginRight: "15px" }}
            />
            <Select
              placeholder="Select a group"
              value={selectedGroup}
              onChange={handleGroupChange}
              style={{ width: 150, marginBottom: 16, marginRight: "15px" }}
            >
              <Option value="">All Groups</Option>
              <Option value="A1">A1</Option>
              <Option value="A2">A2</Option>
              <Option value="B1">B1</Option>
              <Option value="B2">B2</Option>
            </Select>
            <Button
              type="primary"
              onClick={() => showModal(null)}
              style={{ marginBottom: 16 }}
            >
              Add Student
            </Button>
            <Table
              dataSource={filteredStudents}
              columns={columns}
              pagination={{ pageSize: 10 }}
              style={{ marginTop: 0 }}
            />
            <Modal
              title={editingStudent ? "Edit Student" : "Add Student"}
              open={isModalVisible}
              onCancel={handleCancel}
              footer={null}
            >
              <form onSubmit={handleSubmit(onSubmit)}>
                <Controller
                  name="firstname"
                  control={control}
                  defaultValue={editingStudent?.firstname || ""}
                  rules={{ required: "First name is required" }}
                  render={({ field, fieldState }) => (
                    <Form.Item
                      label="First Name"
                      validateStatus={fieldState.error ? "error" : ""}
                      help={fieldState.error?.message}
                    >
                      <Input {...field} />
                    </Form.Item>
                  )}
                />
                <Controller
                  name="lastname"
                  control={control}
                  defaultValue={editingStudent?.lastname || ""}
                  rules={{ required: "Last name is required" }}
                  render={({ field, fieldState }) => (
                    <Form.Item
                      label="Last Name"
                      validateStatus={fieldState.error ? "error" : ""}
                      help={fieldState.error?.message}
                    >
                      <Input {...field} />
                    </Form.Item>
                  )}
                />
                <Controller
                  name="group"
                  control={control}
                  defaultValue={editingStudent?.group || ""}
                  rules={{ required: "Group is required" }}
                  render={({ field, fieldState }) => (
                    <Form.Item
                      label="Group"
                      validateStatus={fieldState.error ? "error" : ""}
                      help={fieldState.error?.message}
                    >
                      <Select {...field} placeholder="Select a group">
                        <Option value="A1">A1</Option>
                        <Option value="A2">A2</Option>
                        <Option value="B1">B1</Option>
                        <Option value="B2">B2</Option>
                      </Select>
                    </Form.Item>
                  )}
                />
                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    {editingStudent ? "Save Changes" : "Add Student"}
                  </Button>
                </Form.Item>
              </form>
            </Modal>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}

export default AllStudents;
