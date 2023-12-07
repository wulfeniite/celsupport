import * as React from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Paper from "@mui/material/Paper";
import { visuallyHidden } from "@mui/utils";
import jwt_decode from "jwt-decode";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CircularProgress from "@mui/material/CircularProgress";
import { IconButton } from "@mui/material";

import { getAllUser, deleteUser } from "../../API";
import UserCard from "./UserCard/UserCard";
import DeleteUserWarning from "./DeleteUserWarning/DeleteUserWarning";

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: "name",
    label: "Name",
  },

  {
    id: "email",
    label: "Email",
  },
  {
    id: "department",
    label: "Department",
  },
  {
    id: "createdAt",
    label: "Created At",
  },
  {
    id: "actions",
    label: "Actions",
    align: "center",
  },
];

function EnhancedTableHead(props) {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.align || "left"}
            padding="normal"
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
};

export default function EnhancedTable(props) {
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("title");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [rows, setRows] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [cardState, setCardState] = React.useState(false);
  const [cardData, setCardData] = React.useState({});
  const [deleteWarningState, setDeleteWarningState] = React.useState(false);
  const [deleteWarningData, setDeleteWarningData] = React.useState("");
  const [userId, setUserId] = React.useState("");
  const [update, setUpdate] = React.useState("");

  const cardOpenHandler = (data) => {
    setCardData(data);
    setCardState(true);
  };

  const cardCloseHandler = () => {
    setCardData({});
    setCardState(false);
  };

  const deleteWarningHandler = (user) => {
    setDeleteWarningData(user);
    setDeleteWarningState(true);
  };

  const deleteUserHandler = async (user) => {
    const data = await deleteUser(userId, user._id);
    if (data.status === "ok") {
      const newRows = rows.filter((row) => row._id !== user._id);
      setRows(newRows);
      cardCloseHandler();
      setDeleteWarningState(false);
    } else {
      alert(`Error deleting issue, ${data.error}`);
    }
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const visibleRows = React.useMemo(
    () =>
      stableSort(rows, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      ),
    [order, orderBy, page, rowsPerPage, rows]
  );

  React.useEffect(() => {
    const issuethingy = async () => {
      setLoading(true);

      const token = localStorage.getItem("token");
      const user = jwt_decode(token);

      setUserId(user.id);

      const data = await getAllUser(user.id);

      var newRows = data.userList;

      newRows?.forEach((user) => {
        user.createdAt = new Date(user.createdAt).toDateString();
      });

      setRows(newRows);
      setLoading(false);
    };
    issuethingy();
  }, [props.currenttab, update]);

  return (
    <Box sx={{ width: "100%" }}>
      {cardState && (
        <UserCard
          update={() => {
            setUpdate(Math.random());
          }}
          data={cardData}
          closecard={() => cardCloseHandler()}
          delete={() => deleteWarningHandler(cardData)}
        />
      )}
      {deleteWarningState && (
        <DeleteUserWarning
          closecard={() => setDeleteWarningState(false)}
          delete={() => deleteUserHandler(deleteWarningData)}
        />
      )}

      {loading ? (
        <CircularProgress />
      ) : (
        <Paper
          sx={{
            width: "100%",
            mb: 2,
            overflow: "auto",
          }}
        >
          <TableContainer
            sx={{ width: "100%", display: "table", tableLayout: "fixed" }}
          >
            <Table
              sx={{ minWidth: 750 }}
              aria-labelledby="tableTitle"
              size={"medium"}
            >
              <EnhancedTableHead
                order={order}
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
              />
              <TableBody>
                {visibleRows.map((row, index) => {
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow hover tabIndex={-1} key={row.name}>
                      <TableCell
                        component="th"
                        id={labelId}
                        scope="row"
                        align="left"
                      >
                        {row.name}
                      </TableCell>
                      <TableCell align="left">{row.email}</TableCell>
                      <TableCell align="left">{row.department}</TableCell>
                      <TableCell align="left">{row.createdAt}</TableCell>
                      <TableCell
                        align="center"
                        sx={{ justifyContent: "space-between" }}
                      >
                        {!row.isAdmin && (
                          <IconButton
                            aria-label="delete"
                            onClick={() => deleteWarningHandler(row)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        )}
                        <IconButton aria-label="view">
                          <VisibilityIcon
                            onClick={() => cardOpenHandler(row)}
                          />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {emptyRows > 0 && (
                  <TableRow
                    style={{
                      height: 53 * emptyRows,
                    }}
                  >
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      )}
    </Box>
  );
}
