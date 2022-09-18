import { useEffect, useState, memo } from "react";

import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Checkbox from "@mui/material/Checkbox";
import TableBody from "@mui/material/TableBody";
import TableSortLabel from "@mui/material/TableSortLabel";
import TableContainer from "@mui/material/TableContainer";
import Box from "@mui/material/Box";
import FilterListIcon from "@mui/icons-material/FilterList";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { alpha } from "@mui/material/styles";
import { visuallyHidden } from "@mui/utils";

import MiruTooltip from '@/components/tooltip';

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import localizedFormat from "dayjs/plugin/localizedFormat";
import "dayjs/locale/vi";
dayjs.extend(localizedFormat)
dayjs.locale("vi");
dayjs.extend(relativeTime);

const headCells = [
  {
    id: "name",
    numeric: false,
    disablePadding: true,
    label: "Tên",
  },
  {
    id: "id",
    numeric: false,
    disablePadding: false,
    label: "ID",
  },
  {
    id: "desc",
    numeric: false,
    disablePadding: false,
    label: "Mô tả",
  },
  {
    id: "status",
    numeric: false,
    disablePadding: false,
    label: "Trạng thái",
  },
  {
    id: "ip",
    numeric: false,
    disablePadding: false,
    label: "Địa chỉ IP",
  },
  {
    id: "mac",
    numeric: false,
    disablePadding: false,
    label: "Địa chỉ MAC",
  },
  {
    id: "model",
    numeric: false,
    disablePadding: false,
    label: "Model",
  },
  {
    id: "createdAt",
    numeric: false,
    disablePadding: false,
    label: "Thời gian tạo",
  },
  {
    id: "updatedAt",
    numeric: false,
    disablePadding: false,
    label: "Lần cập nhật cuối",
  },
];

function createData(
  name,
  id,
  desc,
  status,
  ip,
  mac,
  model,
  createdAt,
  updatedAt
) {
  return {
    name,
    id,
    desc,
    status,
    ip,
    mac,
    model,
    createdAt,
    updatedAt,
  };
}

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

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
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

function TableNodes({ payload, onTableChangeNodes }) {
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("name");
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [dense, setDense] = useState(false);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    setRows(() => {
      return payload.map((node) =>
        createData(
          node?.name,
          node?._id,
          node?.desc,
          node?.socketStatus,
          node?.ipRemote,
          node?.macAddress,
          node?.typeModal,
          node?.createdAt,
          node?.updatedAt
        )
      );
    });
    setSelected([]);
  }, [payload]);

  const isSelected = (id) => selected.indexOf(id) !== -1;

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    console.log("check all");
    if (event.target.checked) {
      const newSelected = rows.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  return (
    <Box
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          setSelected([]);
        }
      }}
    >
      {/* Toolbar TABLE */}
      <Toolbar
        sx={{
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 },
          ...(selected.length > 0 && {
            bgcolor: (theme) =>
              alpha(
                theme.palette.primary.main,
                theme.palette.action.activatedOpacity
              ),
          }),
        }}
      >
        {selected.length > 0 ? (
          <Typography
            sx={{ flex: "1 1 100%" }}
            color="inherit"
            variant="subtitle1"
            component="div"
          >
            Đã chọn {selected.length}
          </Typography>
        ) : (
          <Typography
            sx={{ flex: "1 1 100%" }}
            variant="h6"
            id="tableTitle"
            component="div"
          >
            Quản lí node
          </Typography>
        )}

        {selected.length > 0 ? (
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Tooltip title="Chỉnh sửa">
              <IconButton
                onClick={() => {
                  onTableChangeNodes({ type: "update", ids: selected });
                }}
              >
                <EditIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Xoá">
              <IconButton
                onClick={() => {
                  onTableChangeNodes({ type: "remove", ids: selected });
                }}
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </Box>
        ) : (
          <Tooltip title="Filter list">
            <IconButton>
              <FilterListIcon />
            </IconButton>
          </Tooltip>
        )}
      </Toolbar>

      <TableContainer sx={{ position: "relative" }}>
        <Table
          sx={{ minWidth: 750 }}
          aria-labelledby="tableTitle"
          size={false ? "small" : "medium"}
        >
          {/* HEADER TABLE */}
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  color="primary"
                  indeterminate={
                    selected.length > 0 && selected.length < rows.length
                  }
                  checked={rows.length > 0 && selected.length === rows.length}
                  onChange={handleSelectAllClick}
                  inputProps={{
                    "aria-label": "select all desserts",
                  }}
                />
              </TableCell>
              {headCells.map((headCell) => (
                <TableCell
                  sx={{ whiteSpace: "nowrap" }}
                  key={headCell.id}
                  align={headCell.numeric ? "right" : "left"}
                  padding={headCell.disablePadding ? "none" : "normal"}
                  sortDirection={orderBy === headCell.id ? order : false}
                >
                  <TableSortLabel
                    active={orderBy === headCell.id}
                    direction={orderBy === headCell.id ? order : "asc"}
                    onClick={() => {
                      handleRequestSort(headCell.id);
                    }}
                  >
                    {headCell.label}
                    {orderBy === headCell.id ? (
                      <Box component="span" sx={visuallyHidden}>
                        {order === "desc"
                          ? "sorted descending"
                          : "sorted ascending"}
                      </Box>
                    ) : null}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          {/* BODY TABLE */}
          <TableBody>
            {/* if you don't need to support IE11, you can replace the `stableSort` call with:
                  rows.slice().sort(getComparator(order, orderBy)) */}
            {stableSort(rows, getComparator(order, orderBy))
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => {
                const isItemSelected = isSelected(row.id);
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow
                    hover
                    onClick={(event) => handleClick(event, row.id)}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.id}
                    selected={isItemSelected}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        color="primary"
                        checked={isItemSelected}
                        inputProps={{
                          "aria-labelledby": labelId,
                        }}
                      />
                    </TableCell>
                    <TableCell
                      component="th"
                      id={labelId}
                      scope="row"
                      padding="none"
                      sx={{ whiteSpace: "nowrap" }}
                    >
                      {row.name}
                    </TableCell>
                    <TableCell sx={{ whiteSpace: "nowrap" }} align="left">
                      {row.id}
                    </TableCell>
                    <TableCell
                      sx={{
                        whiteSpace: "nowrap",
                        maxWidth: "300px",
                        textOverflow: "ellipsis",
                        overflow: "hidden",
                      }}
                      align="left"
                    >
                      {row.desc}
                    </TableCell>
                    <TableCell sx={{ whiteSpace: "nowrap" }} align="left">
                      {row.status}
                    </TableCell>
                    <TableCell sx={{ whiteSpace: "nowrap" }} align="left">
                      {row.ip}
                    </TableCell>
                    <TableCell sx={{ whiteSpace: "nowrap" }} align="left">
                      {row.mac}
                    </TableCell>
                    <TableCell sx={{ whiteSpace: "nowrap" }} align="left">
                      {row.model}
                    </TableCell>
                    <MiruTooltip placement={'left'} disableInteractive title={dayjs(row.createdAt).format('llll')}>
                      <TableCell sx={{ whiteSpace: "nowrap" }} align="left">
                        {dayjs(row.createdAt).fromNow()}
                      </TableCell>
                    </MiruTooltip>
                    <MiruTooltip placement={'left'} disableInteractive title={dayjs(row.updatedAt).format('llll')}>
                      <TableCell sx={{ whiteSpace: "nowrap" }} align="left">
                        {dayjs(row.updatedAt).fromNow()}
                      </TableCell>
                    </MiruTooltip>
                  </TableRow>
                );
              })}
            {emptyRows > 0 && (
              <TableRow
                style={{
                  height: (dense ? 33 : 53) * emptyRows,
                }}
              >
                <TableCell colSpan={6} />
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination TABLE */}
      <TablePagination
        labelRowsPerPage={"Phân trang"}
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Box>
  );
}

export default memo(TableNodes);
