import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import {
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Tab,
} from '@mui/material'
import DownloadIcon from '@mui/icons-material/Download'

import {
  queryVehicleFormularies,
  queryJobFormularies,
  queryCombinedData,
  QueryParams,
} from '../services/api'

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`query-tabpanel-${index}`}
      aria-labelledby={`query-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  )
}

const QueryPage = () => {
  const [tabValue, setTabValue] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [vehicleData, setVehicleData] = useState<any[]>([])
  const [jobData, setJobData] = useState<any[]>([])
  
  const { control, handleSubmit } = useForm<QueryParams>({
    defaultValues: {
      employee_id: undefined,
      job_id: undefined,
      vehicle_id: undefined,
      format: 'json',
    },
  })

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  const onSubmit = async (data: QueryParams) => {
    try {
      setIsLoading(true)
      
      if (data.format === 'excel') {
        // Handle Excel download based on current tab
        if (tabValue === 0) {
          await queryVehicleFormularies({ ...data, format: 'excel' })
        } else if (tabValue === 1) {
          await queryJobFormularies({ ...data, format: 'excel' })
        } else {
          await queryCombinedData({ ...data, format: 'excel' })
        }
      } else {
        // Handle JSON data retrieval based on current tab
        if (tabValue === 0) {
          const result = await queryVehicleFormularies(data)
          setVehicleData(result || [])
          setJobData([])
        } else if (tabValue === 1) {
          const result = await queryJobFormularies(data)
          setJobData(result || [])
          setVehicleData([])
        } else {
          const result = await queryCombinedData(data)
          setVehicleData(result?.vehicle_formularies || [])
          setJobData(result?.job_formularies || [])
        }
      }
    } catch (error) {
      console.error('Error querying data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="form-container">
      <Typography variant="h4" component="h1" className="page-title">
        Query Data
      </Typography>
      
      <Typography variant="body1" paragraph>
        Use this page to query and download data from the database. You can filter by employee, job, or vehicle.
      </Typography>
      
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Controller
                name="employee_id"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Employee ID (optional)"
                    type="number"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    value={field.value || ''}
                    onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                  />
                )}
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Controller
                name="job_id"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Job ID (optional)"
                    type="number"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    value={field.value || ''}
                    onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                  />
                )}
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Controller
                name="vehicle_id"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Vehicle ID (optional)"
                    type="number"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    value={field.value || ''}
                    onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                  />
                )}
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Controller
                name="format"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel>Format</InputLabel>
                    <Select {...field} label="Format">
                      <MenuItem value="json">JSON (view in browser)</MenuItem>
                      <MenuItem value="excel">Excel (download)</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={isLoading}
                  startIcon={isLoading ? <CircularProgress size={20} /> : <DownloadIcon />}
                >
                  {isLoading ? 'Loading...' : 'Query Data'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
      
      <Paper elevation={3}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="query tabs">
            <Tab label="Vehicle Forms" />
            <Tab label="Job Forms" />
            <Tab label="Combined Data" />
          </Tabs>
        </Box>
        
        <TabPanel value={tabValue} index={0}>
          {vehicleData.length > 0 ? (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Employee ID</TableCell>
                    <TableCell>Employee Name</TableCell>
                    <TableCell>Job ID</TableCell>
                    <TableCell>Job Place</TableCell>
                    <TableCell>Vehicle ID</TableCell>
                    <TableCell>Vehicle Condition</TableCell>
                    <TableCell>Vehicle Clean</TableCell>
                    <TableCell>Comments</TableCell>
                    <TableCell>Timestamp</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {vehicleData.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell>{row.id}</TableCell>
                      <TableCell>{row.employee_id}</TableCell>
                      <TableCell>{row.employee_name}</TableCell>
                      <TableCell>{row.job_id}</TableCell>
                      <TableCell>{row.job_place}</TableCell>
                      <TableCell>{row.vehicle_id}</TableCell>
                      <TableCell>{row.vehicle_condition}</TableCell>
                      <TableCell>{row.vehicle_clean}</TableCell>
                      <TableCell>{row.comments}</TableCell>
                      <TableCell>{new Date(row.timestamp).toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography variant="body1" sx={{ p: 2 }}>
              No vehicle form data to display. Please query the database.
            </Typography>
          )}
        </TabPanel>
        
        <TabPanel value={tabValue} index={1}>
          {jobData.length > 0 ? (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Employee ID</TableCell>
                    <TableCell>Employee Name</TableCell>
                    <TableCell>Job ID</TableCell>
                    <TableCell>Job Place</TableCell>
                    <TableCell>Time to Commute</TableCell>
                    <TableCell>Time of Work</TableCell>
                    <TableCell>Vehicle ID</TableCell>
                    <TableCell>Nails Used</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {jobData.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell>{row.id}</TableCell>
                      <TableCell>{row.employee_id}</TableCell>
                      <TableCell>{row.employee_name}</TableCell>
                      <TableCell>{row.job_id}</TableCell>
                      <TableCell>{row.job_place}</TableCell>
                      <TableCell>{row.time_to_commute}</TableCell>
                      <TableCell>{row.time_of_work}</TableCell>
                      <TableCell>{row.vehicle_id}</TableCell>
                      <TableCell>{row.nails_used}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography variant="body1" sx={{ p: 2 }}>
              No job form data to display. Please query the database.
            </Typography>
          )}
        </TabPanel>
        
        <TabPanel value={tabValue} index={2}>
          <Typography variant="h6" gutterBottom>
            Vehicle Forms
          </Typography>
          {vehicleData.length > 0 ? (
            <TableContainer sx={{ mb: 4 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Employee ID</TableCell>
                    <TableCell>Employee Name</TableCell>
                    <TableCell>Job ID</TableCell>
                    <TableCell>Job Place</TableCell>
                    <TableCell>Vehicle ID</TableCell>
                    <TableCell>Vehicle Condition</TableCell>
                    <TableCell>Vehicle Clean</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {vehicleData.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell>{row.id}</TableCell>
                      <TableCell>{row.employee_id}</TableCell>
                      <TableCell>{row.employee_name}</TableCell>
                      <TableCell>{row.job_id}</TableCell>
                      <TableCell>{row.job_place}</TableCell>
                      <TableCell>{row.vehicle_id}</TableCell>
                      <TableCell>{row.vehicle_condition}</TableCell>
                      <TableCell>{row.vehicle_clean}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography variant="body1" sx={{ p: 2, mb: 4 }}>
              No vehicle form data to display. Please query the database.
            </Typography>
          )}
          
          <Typography variant="h6" gutterBottom>
            Job Forms
          </Typography>
          {jobData.length > 0 ? (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Employee ID</TableCell>
                    <TableCell>Employee Name</TableCell>
                    <TableCell>Job ID</TableCell>
                    <TableCell>Job Place</TableCell>
                    <TableCell>Time to Commute</TableCell>
                    <TableCell>Time of Work</TableCell>
                    <TableCell>Vehicle ID</TableCell>
                    <TableCell>Nails Used</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {jobData.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell>{row.id}</TableCell>
                      <TableCell>{row.employee_id}</TableCell>
                      <TableCell>{row.employee_name}</TableCell>
                      <TableCell>{row.job_id}</TableCell>
                      <TableCell>{row.job_place}</TableCell>
                      <TableCell>{row.time_to_commute}</TableCell>
                      <TableCell>{row.time_of_work}</TableCell>
                      <TableCell>{row.vehicle_id}</TableCell>
                      <TableCell>{row.nails_used}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography variant="body1" sx={{ p: 2 }}>
              No job form data to display. Please query the database.
            </Typography>
          )}
        </TabPanel>
      </Paper>
    </div>
  )
}

export default QueryPage 