import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import GoalForm from '../Components/GoalForm/GoalForm'
import { getGoals, reset } from '../features/goals/goalSlice'
import Spinner from '../Components/Spinner/Spinner'
import GoalItem from '../Components/GoalItem/GoalItem'

function Dashboard() {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { user } = useSelector((state) => state.auth)
  const { goals, isError, message, isLoading } = useSelector((state) => state.goals)
  useEffect(() => {
    if (!user) {
      navigate('/login')
    }
    if (isError) {
      console.log(message)
    }
    dispatch(getGoals())
    return () => {
      dispatch(reset())
    }
  }, [user, navigate, isError, message, dispatch])

  if (isLoading) {
    <Spinner />
  }
  return (
    <>
      <section className="heading">
        <h1>Welcome {user && user.name}</h1>
        <p>Goals Dashboard</p>
      </section>
      <GoalForm />
      <section className='content'>
        {goals.length > 0 ? (<div className="goals">
          {goals.map((goal) =>
            <GoalItem key={goal._id} goal={goal} />)}
        </div>) :
          (<h3>You Have Not Set Any Goal</h3>)}
      </section>
    </>
  )
}

export default Dashboard