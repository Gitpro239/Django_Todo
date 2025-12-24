from django.shortcuts import render, redirect
from django.http import HttpResponse
from .models import Task
from .forms import TaskForm
from django.contrib import messages
from django.contrib.auth.decorators import login_required


def homePage(request):
    return render(request, "home_page.html")


def task_list(request):
    if request.method == "GET":
        tasks = Task.objects.all()
    return render(request, "task_list.html", {"tasks": tasks})


@login_required
def task_create(request):
    if request.method == 'POST':
        form = TaskForm(request.POST)
        if form.is_valid():
            form.save()
            messages.success(request, "Task created successfully!")
            return redirect("task_list")
    else:
        form = TaskForm()
    return render(request, "task_form.html", {"form": form})


@login_required(login_url="/api-auth/login/")
def task_detail(request,pk):
    try:
        if request.method == "GET":
            task = Task.objects.get(pk=pk)
    except Task.DoesNotExist:
        return HttpResponse(status=404)
    else:
        return render(request, "task_detail.html", {"task": task})
    

@login_required(login_url="/admin/login/")
def task_update(request, pk):
    try:
        task = Task.objects.get(pk=pk)    
        
    except Task.DoesNotExist:
        return HttpResponse(status=404)
    
    if request.method == "POST":
        form = TaskForm(request.POST, request.FILES , instance=task)
        if form.is_valid():
            form.save()
            messages.success(request, "Task updated successfully!")
            return redirect("task_detail", pk=pk)
    else:
        form = TaskForm(instance=task)
    return render(request, "task_form.html", {"form": form})


@login_required(login_url="/accounts/login/")
def task_delete(request, pk):
    try:
        task = Task.objects.get(pk=pk)
    
    except Task.DoesNotExist:
        return HttpResponse(status=404)
    
    else:
        if request.method == "POST":
            task.delete()
            messages.success(request, "Task deleted successsfully!")
            return redirect("task_list.html")
        return render (request, "task_delete.html")
    

#########################################################################################

from django.http import HttpResponse, HttpResponseServerError
from django.shortcuts import render, redirect, get_object_or_404
from django.views import View
from .models import Task
from .forms import TaskForm

class HomePage(View):
    def get(self, request):
      return HttpResponse("Hello Admin")


class TaskListView(View):
    def get(self, request):
        try:
            tasks= Task.objects.all()
            return render(request, "person_list.html", {"tasks": tasks})
        except Task.DoesNotExist:
            raise HttpResponse(status=404)
        except Exception as e:
            return HttpResponseServerError(f"Error retrieving list: {e}")


class TaskDetailView(View):
    def get(self, request, pk):
        try:
            task = Task.objects.get(pk=pk)
            return render(request, 'task_detail.html', {'task': task})
        except Task.DoesNotExist :
            return HttpResponse(status=404)
        except Exception as e:
            return HttpResponseServerError(f"Error retrieving list: {e}")
        

class TaskCreateView(View):
    def get(self, request, *args, **kwargs):
        form = TaskForm()
        return render(request, "task_form.html", {'form': form})

    def post(self, request, *args, **kwargs):
        form = TaskForm(request.POST)
        try:
            if form.is_valid():
                form.save()
                return redirect('task_list') 
            return render(request, "task_form.html", {'form': form}) 
        except Task.DoesNotExist:
            return HttpResponse(status=404)
        except Exception as e:
            return HttpResponseServerError(f"Error retrieving list: {e}")
        

class TaskUpdateView(View):
    def get(self, request, pk):
        task = Task.objects.get(pk=pk)
        form = TaskForm(instance=task)
        return render(request, 'task_form.html', {'form': form, 'task': task})

    def post(self, request, pk):
        task = Task.objects.get(pk=pk)
        form = TaskForm(request.POST, instance=task)
        try:
            if form.is_valid():
                form.save()
                return redirect('task_detail', pk=pk)
            return render(request, 'task_form.html', {'form': form, 'task': task})
        except Task.DoesNotExist:
            return HttpResponse(status=404)
        except Exception as e:
            return HttpResponseServerError(f"Error retrieving list: {e}")
        


class TaskDeleteView(View):
    def get(self, request, pk):
        try:
            # task = get_object_or_404(Task, pk=pk)
            task = Task.objects.get(pk=pk)
            return render(request, 'task_delete.html', {'task': task})
        except Task.DoesNotExist :
            return HttpResponse(status=404)

    def post(self, request, pk):
        task = Task.objects.get(pk=pk)
        try:
            task.delete()
            return redirect("task_list")
        except Task.DoesNotExist:
            return HttpResponse(status=404)
        except Exception as e:
            return HttpResponseServerError(f"Error retrieving list: {e}")





# class MemberCreateView(View):

#     form_class = MemberForm
#     template_name = 'member_form.html'

#     def get(self, request, *args, **kwargs):
#         """
#         Handles GET requests: displays the member form.
#         """
#         form = self.form_class()
#         return render(request, self.template_name, {'form': form}) 

#     def post(self, request, *args, **kwargs):
#         """
#         Handles POST requests: processes form submission.
#         """
#         form = MemberForm(request.POST) 
#         if form.is_valid():
#             form.save()
#             return redirect('member_list') 
#         return render(request, self.template_name, {'form': form}) 
