import unittest
import os
import tempfile
import json
import app

class TestTaskFlow(unittest.TestCase):
    def setUp(self):
        # Redirect DB_FILE to a temporary file
        self.test_db_fd, self.test_db_path = tempfile.mkstemp()
        app.DB_FILE = self.test_db_path
        
    def tearDown(self):
        os.close(self.test_db_fd)
        if os.path.exists(self.test_db_path):
            os.remove(self.test_db_path)

    def test_load_tasks_empty_when_no_file(self):
        if os.path.exists(self.test_db_path):
            os.remove(self.test_db_path)
        tasks = app.load_tasks()
        self.assertEqual(tasks, [])

    def test_save_and_load_tasks(self):
        sample_tasks = [
            {"id": "1", "text": "Test Task 1", "completed": False, "created_at": 12345.6},
            {"id": "2", "text": "Test Task 2", "completed": True, "created_at": 12347.8}
        ]
        app.save_tasks(sample_tasks)
        loaded = app.load_tasks()
        self.assertEqual(len(loaded), 2)
        self.assertEqual(loaded[0]["text"], "Test Task 1")
        self.assertTrue(loaded[1]["completed"])

    def test_load_tasks_malformed_json_fallback(self):
        with open(self.test_db_path, "w") as f:
            f.write("invalid json content")
        tasks = app.load_tasks()
        self.assertEqual(tasks, [])

if __name__ == "__main__":
    unittest.main()
