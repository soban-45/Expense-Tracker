from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import User
from .serializers import *

class RegisterUserAPIView(APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response({"message": "User registered successfully."}, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class LoginAPIView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)

        if serializer.is_valid():
            user = serializer.validated_data['user']
            return Response({
                "message": "Login successful.",
                "username": user.username,
                "email": user.email,
                "role": user.role
            }, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ExpenseAPIView(APIView):
    # Helper method to get the expense object or return None
    def get_expense(self, id):
        try:
            return ExpenseTable.objects.get(id=id)
        except ExpenseTable.DoesNotExist:
            return None

    # GET: Retrieve all expenses or a specific expense by id
    def get(self, request):
        expense_id = request.query_params.get('id')  # Get id from query params
        if expense_id:
            expense = self.get_expense(expense_id)
            if not expense:
                return Response({"error": "Expense not found"}, status=status.HTTP_404_NOT_FOUND)
            serializer = ExpenseTableSerializer(expense)
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        # If no ID is provided, return all expenses
        expenses = ExpenseTable.objects.all()
        serializer = ExpenseTableSerializer(expenses, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    # POST: Create a new expense
    def post(self, request):
        serializer = ExpenseTableSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # PUT: Update an expense by id
    def put(self, request):
        expense_id = request.query_params.get('id')  # Get id from query params
        if not expense_id:
            return Response({"error": "ID is required for updating"}, status=status.HTTP_400_BAD_REQUEST)

        expense = self.get_expense(expense_id)
        if not expense:
            return Response({"error": "Expense not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = ExpenseTableSerializer(expense, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # DELETE: Delete an expense by id
    def delete(self, request):
        expense_id = request.query_params.get('id')  # Get id from query params
        if not expense_id:
            return Response({"error": "ID is required for deleting"}, status=status.HTTP_400_BAD_REQUEST)

        expense = self.get_expense(expense_id)
        if not expense:
            return Response({"error": "Expense not found"}, status=status.HTTP_404_NOT_FOUND)

        expense.delete()
        return Response({"message": "Expense deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
