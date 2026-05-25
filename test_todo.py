import os
import json
import unittest
import todo

class TodoAppTestCase(unittest.TestCase):
    def setUp(self):
        # Configure app for testing
        todo.app.config['TESTING'] = True
        self.app = todo.app.test_client()
        
        # Override the database file path to a test database file
        self.test_db = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'test_tasks.json')
        todo.DB_FILE = self.test_db
        
        # Clean up any leftover test database
        if os.path.exists(self.test_db):
            os.remove(self.test_db)

    def tearDown(self):
        # Clean up test database
        if os.path.exists(self.test_db):
            os.remove(self.test_db)

    def test_empty_tasks(self):
        """Test retrieving tasks from an empty database."""
        response = self.app.get('/api/tasks')
        self.assertEqual(response.status_code, 200)
        tasks = json.loads(response.data)
        self.assertEqual(tasks, [])

    def test_add_task(self):
        """Test adding a task successfully."""
        response = self.app.post('/api/tasks', 
                                 data=json.dumps({'text': 'Buy groceries'}),
                                 content_type='application/json')
        self.assertEqual(response.status_code, 201)
        data = json.loads(response.data)
        self.assertIn('id', data)
        self.assertEqual(data['text'], 'Buy groceries')
        self.assertEqual(data['completed'], False)

        # Check if it was saved to the list
        response_get = self.app.get('/api/tasks')
        tasks = json.loads(response_get.data)
        self.assertEqual(len(tasks), 1)
        self.assertEqual(tasks[0]['text'], 'Buy groceries')

    def test_add_empty_task(self):
        """Test adding an empty task returns 400 Bad Request."""
        response = self.app.post('/api/tasks', 
                                 data=json.dumps({'text': '   '}),
                                 content_type='application/json')
        self.assertEqual(response.status_code, 400)
        data = json.loads(response.data)
        self.assertIn('error', data)

    def test_toggle_task(self):
        """Test toggling a task's completed status."""
        # First add a task
        response_add = self.app.post('/api/tasks', 
                                     data=json.dumps({'text': 'Read a book'}),
                                     content_type='application/json')
        task = json.loads(response_add.data)
        task_id = task['id']

        # Toggle completed (False -> True)
        response_toggle = self.app.put(f'/api/tasks/{task_id}/toggle')
        self.assertEqual(response_toggle.status_code, 200)
        data = json.loads(response_toggle.data)
        self.assertEqual(data['completed'], True)

        # Toggle back (True -> False)
        response_toggle2 = self.app.put(f'/api/tasks/{task_id}/toggle')
        self.assertEqual(response_toggle2.status_code, 200)
        data2 = json.loads(response_toggle2.data)
        self.assertEqual(data2['completed'], False)

    def test_delete_task(self):
        """Test deleting a task."""
        # Add a task
        response_add = self.app.post('/api/tasks', 
                                     data=json.dumps({'text': 'Clean room'}),
                                     content_type='application/json')
        task = json.loads(response_add.data)
        task_id = task['id']

        # Delete the task
        response_delete = self.app.delete(f'/api/tasks/{task_id}')
        self.assertEqual(response_delete.status_code, 200)
        data = json.loads(response_delete.data)
        self.assertTrue(data['success'])

        # Verify task list is empty again
        response_get = self.app.get('/api/tasks')
        tasks = json.loads(response_get.data)
        self.assertEqual(len(tasks), 0)
    def test_add_task_with_category(self):
        """Test adding a task with a category tag."""
        response = self.app.post('/api/tasks', 
                                 data=json.dumps({'text': 'Submit report', 'category': 'Work'}),
                                 content_type='application/json')
        self.assertEqual(response.status_code, 201)
        data = json.loads(response.data)
        self.assertEqual(data['text'], 'Submit report')
        self.assertEqual(data['category'], 'Work')

        # Check if category is preserved in GET call
        response_get = self.app.get('/api/tasks')
        tasks = json.loads(response_get.data)
        self.assertEqual(len(tasks), 1)
        self.assertEqual(tasks[0]['category'], 'Work')

if __name__ == '__main__':
    unittest.main()
